import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  fetchNcPrograms,
  createNcProgram,
  editNcProgram,
  addProgramVersion,
  blockProgramVersion,
  deleteProgramVersion,
  createNcProgramFromEditor,
  addProgramVersionFromEditor,
  fetchVersionContent,
  deleteNcProgram,
} from '../ncProgramThunk';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { DEBOUNCE_DELAY, PAGINATION_LIMIT } from '@/shared/constants/constant';
import { Input } from '@/shared/components/ui/input';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Plus, Search, RefreshCcw } from 'lucide-react';
import ReusableModal from '@/shared/components/custom/ReusableModal';
import NcEditorModal from '../components/NcEditorModal';
import NcProgramTable from '../components/NcProgramTable';
import VersionViewModalContent from '../components/VersionViewModalContent';
import type { NcProgram, ProgramVersion } from '../types';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  editNcProgramSchema,
  type EditNcProgramFormData,
} from '../validators/ncProgramValidator';
import Swal from 'sweetalert2';

const NcProgramDashBoard = () => {
  const dispatch = useAppDispatch();
  const { programs, total, loading } = useAppSelector(
    (state) => state.ncProgram,
  );

  const [pageSize] = useState(PAGINATION_LIMIT);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);
  const [currentPage, setCurrentPage] = useState(0);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddVersionModalOpen, setIsAddVersionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isVersionsModalOpen, setIsVersionsModalOpen] = useState(false);

  const [selectedProgram, setSelectedProgram] = useState<NcProgram | null>(
    null,
  );
  const [selectedVersion, setSelectedVersion] = useState<ProgramVersion | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const swalWithButtons = useMemo(
    () =>
      Swal.mixin({
        customClass: {
          actions: 'flex gap-3',
          confirmButton: buttonVariants({ variant: 'primary', size: 'lg' }),
          cancelButton: buttonVariants({ variant: 'destructive', size: 'lg' }),
        },
        buttonsStyling: false,
      }),
    [],
  );

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<EditNcProgramFormData>({
    resolver: zodResolver(
      editNcProgramSchema,
    ) as Resolver<EditNcProgramFormData>,
  });

  const loadData = useCallback(() => {
    dispatch(
      fetchNcPrograms({
        page: currentPage + 1,
        limit: pageSize,
        search: debouncedSearch,
      }),
    );
  }, [dispatch, pageSize, currentPage, debouncedSearch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch]);

  const handleCreateProgram = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      const result = await dispatch(createNcProgram(formData)).unwrap();
      if (result.success) {
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.NC_PROGRAM_CREATED);
        setIsAddModalOpen(false);
      }
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message || (error as string);
      notifyError(
        errorMessage ||
          FRONTEND_MESSAGE_CONSTANTS.ERROR.NC_PROGRAM_CREATION_FAILED,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProgram = async (data: EditNcProgramFormData) => {
    if (!selectedProgram) return;
    try {
      setIsSubmitting(true);
      const result = await dispatch(
        editNcProgram({ id: selectedProgram.id, name: data.name }),
      ).unwrap();
      if (result.success) {
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.NC_PROGRAM_UPDATED);
        setIsEditModalOpen(false);
        setSelectedProgram(null);
        resetEdit();
      }
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message || (error as string);
      notifyError(
        errorMessage ||
          FRONTEND_MESSAGE_CONSTANTS.ERROR.NC_PROGRAM_UPDATE_FAILED,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVersion = async (formData: FormData) => {
    if (!selectedProgram) return;
    try {
      setIsSubmitting(true);
      const result = await dispatch(
        addProgramVersion({ programId: selectedProgram.id, formData }),
      ).unwrap();
      if (result.success) {
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.VERSION_ADDED);
        setIsAddVersionModalOpen(false);
        setSelectedProgram(null);
      }
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message || (error as string);
      notifyError(
        errorMessage || FRONTEND_MESSAGE_CONSTANTS.ERROR.VERSION_ADD_FAILED,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProgramFromEditor = async (
    content: string,
    description?: string,
    name?: string,
  ) => {
    if (!name) return;
    try {
      setIsSubmitting(true);
      const result = await dispatch(
        createNcProgramFromEditor({ name, content, description }),
      ).unwrap();
      if (result.success) {
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.NC_PROGRAM_CREATED);
        setIsAddModalOpen(false);
      }
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message || (error as string);
      notifyError(
        errorMessage ||
          FRONTEND_MESSAGE_CONSTANTS.ERROR.NC_PROGRAM_CREATION_FAILED,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVersionFromEditor = async (
    content: string,
    description?: string,
  ) => {
    if (!selectedProgram) return;
    try {
      setIsSubmitting(true);
      const result = await dispatch(
        addProgramVersionFromEditor({
          programId: selectedProgram.id,
          content,
          description,
        }),
      ).unwrap();
      if (result.success) {
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.VERSION_ADDED);
        setIsAddVersionModalOpen(false);
        setSelectedProgram(null);
      }
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message || (error as string);
      notifyError(
        errorMessage || FRONTEND_MESSAGE_CONSTANTS.ERROR.VERSION_ADD_FAILED,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadPreviousVersionContent = async (): Promise<string> => {
    if (!selectedProgram) return '';
    const versions = selectedProgram.versions || [];
    if (!versions.length) {
      throw new Error('No previous version exists');
    }
    const latest = [...versions].reverse().find((v) => !v.isDeleted);
    if (!latest) {
      throw new Error('No active previous version found');
    }
    try {
      const result = await dispatch(fetchVersionContent(latest.id)).unwrap();
      return result.data?.content || '';
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message || (error as string);
      notifyError(errorMessage || 'Failed to fetch previous version content');
      throw error;
    }
  };

  const handleBlockVersion = useCallback(
    async (version: ProgramVersion) => {
      const action = version.isBlocked ? 'Unblock' : 'Block';
      const result = await swalWithButtons.fire({
        title: 'Are you sure?',
        text: `Do you want to ${action.toLowerCase()} this version?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Yes, ${action} it!`,
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        try {
          await dispatch(blockProgramVersion(version.id)).unwrap();
          notifySuccess(
            version.isBlocked
              ? FRONTEND_MESSAGE_CONSTANTS.SUCCESS.VERSION_UNBLOCKED
              : FRONTEND_MESSAGE_CONSTANTS.SUCCESS.VERSION_BLOCKED,
          );
        } catch (error) {
          const errorMessage =
            (error as { message?: string })?.message || (error as string);
          notifyError(
            errorMessage ||
              FRONTEND_MESSAGE_CONSTANTS.ERROR.VERSION_BLOCK_FAILED,
          );
        }
      }
    },
    [dispatch, swalWithButtons],
  );

  const handleDeleteVersion = useCallback(
    async (version: ProgramVersion) => {
      const result = await swalWithButtons.fire({
        title: 'Are you sure?',
        text: "This version will be soft deleted. You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        try {
          await dispatch(deleteProgramVersion(version.id)).unwrap();
          notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.VERSION_DELETED);
        } catch (error) {
          const errorMessage =
            (error as { message?: string })?.message || (error as string);
          notifyError(
            errorMessage ||
              FRONTEND_MESSAGE_CONSTANTS.ERROR.VERSION_DELETE_FAILED,
          );
        }
      }
    },
    [dispatch, swalWithButtons],
  );

  const handleDeleteProgram = useCallback(
    async (program: NcProgram) => {
      const result = await swalWithButtons.fire({
        title: 'Are you sure?',
        text: `Do you want to delete the NC program "${program.name}"? You won't be able to revert this!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        try {
          await dispatch(deleteNcProgram(program.id)).unwrap();
          notifySuccess(
            FRONTEND_MESSAGE_CONSTANTS.SUCCESS.NC_PROGRAM_DELETED ||
              'NC Program deleted successfully',
          );
        } catch (error) {
          const errorMessage =
            (error as { message?: string })?.message || (error as string);
          notifyError(
            errorMessage ||
              FRONTEND_MESSAGE_CONSTANTS.ERROR.NC_PROGRAM_DELETE_FAILED ||
              'Failed to delete NC program',
          );
        }
      }
    },
    [dispatch, swalWithButtons],
  );

  const openEditModal = (program: NcProgram) => {
    setSelectedProgram(program);
    resetEdit({ name: program.name });
    setIsEditModalOpen(true);
  };

  const openAddVersionModal = (program: NcProgram) => {
    setSelectedProgram(program);
    setIsAddVersionModalOpen(true);
  };

  const openViewModal = (version: ProgramVersion) => {
    setSelectedVersion(version);
    setIsVersionsModalOpen(false);
    setIsViewModalOpen(true);
  };

  const liveSelectedProgram = selectedProgram
    ? programs.find((p) => p.id === selectedProgram.id)
    : null;

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            NC Program Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage CNC programs and version history
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={18} />
          <span>Add Program</span>
        </Button>
      </div>

      {/* Search + Refresh */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search programs..."
            className="pl-10"
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => loadData()}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#4f46e5]/30 border-t-[#4f46e5] rounded-full animate-spin" />
          </div>
        )}
        <NcProgramTable
          programs={programs}
          total={total}
          pageIndex={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onAddVersion={openAddVersionModal}
          onEditProgram={openEditModal}
          onShowVersions={(program) => {
            setSelectedProgram(program);
            setIsVersionsModalOpen(true);
          }}
          onDeleteProgram={handleDeleteProgram}
        />
      </div>

      {/* Create Modal */}
      {isAddModalOpen && (
        <NcEditorModal
          mode="create"
          loading={isSubmitting}
          onClose={() => setIsAddModalOpen(false)}
          onSubmitFile={handleCreateProgram}
          onSubmitEditor={handleCreateProgramFromEditor}
        />
      )}

      {/* Edit Modal */}
      <ReusableModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProgram(null);
          resetEdit();
        }}
        title="Edit NC Program"
        maxWidth="max-w-md"
      >
        <form
          onSubmit={handleEditSubmit(handleEditProgram)}
          className="space-y-4"
        >
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">
              Program Name <span className="text-red-500">*</span>
            </label>
            <Input {...registerEdit('name')} placeholder="e.g. Fan Cover" />
            {editErrors.name && (
              <p className="text-xs text-red-500">{editErrors.name.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-10"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </ReusableModal>

      {/* Add Version Modal */}
      {isAddVersionModalOpen && (
        <NcEditorModal
          mode="addVersion"
          programName={selectedProgram?.name}
          loading={isSubmitting}
          onClose={() => {
            setIsAddVersionModalOpen(false);
            setSelectedProgram(null);
          }}
          onSubmitFile={handleAddVersion}
          onSubmitEditor={handleAddVersionFromEditor}
          loadPreviousContent={handleLoadPreviousVersionContent}
        />
      )}

      {/* View Version Modal */}
      <ReusableModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedVersion(null);
          setIsVersionsModalOpen(true);
        }}
        title={`Version v${selectedVersion?.versionNumber || ''} Details`}
        maxWidth="max-w-xl"
      >
        {selectedVersion && (
          <VersionViewModalContent version={selectedVersion} />
        )}
      </ReusableModal>

      {/* Manage Versions Modal */}
      <ReusableModal
        isOpen={isVersionsModalOpen}
        onClose={() => {
          setIsVersionsModalOpen(false);
          setSelectedProgram(null);
        }}
        title={`Versions — ${liveSelectedProgram?.name || ''}`}
        maxWidth="max-w-4xl"
      >
        {liveSelectedProgram && (
          <div className="bg-white rounded-md overflow-hidden border border-gray-200">
            {liveSelectedProgram.versions?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#f8f9fc]">
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Version
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        File
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Uploaded
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {liveSelectedProgram.versions.map((version) => (
                      <tr
                        key={version.id}
                        className={version.isDeleted ? 'opacity-50' : ''}
                      >
                        <td className="px-4 py-3 font-semibold text-gray-800">
                          v{version.versionNumber}
                        </td>
                        <td
                          className="px-4 py-3 text-gray-600 max-w-[200px] truncate"
                          title={version.fileName || ''}
                        >
                          {version.fileName || '—'}
                        </td>
                        <td className="px-4 py-3">
                          {version.isDeleted ? (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              Deleted
                            </span>
                          ) : version.isBlocked ? (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                              Blocked
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {new Date(version.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!version.isDeleted && (
                              <>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => openViewModal(version)}
                                  className="h-7 px-2 text-xs"
                                >
                                  View
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleBlockVersion(version)}
                                  className={`h-7 px-2 text-xs ${version.isBlocked ? 'text-green-600' : 'text-yellow-600'}`}
                                >
                                  {version.isBlocked ? 'Unblock' : 'Block'}
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleDeleteVersion(version)}
                                  className="h-7 px-2 text-xs text-red-600"
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-4 py-6 text-sm text-gray-500 text-center">
                No versions available.
              </div>
            )}
          </div>
        )}
      </ReusableModal>
    </div>
  );
};

export default NcProgramDashBoard;
