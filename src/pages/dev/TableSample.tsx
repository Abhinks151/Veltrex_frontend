// import {
//   createColumnHelper,
//   useReactTable,
//   getCoreRowModel,
//   getPaginationRowModel,
//   flexRender,
// } from '@tanstack/react-table';

// type User = {
//   id: number;
//   name: string;
//   email: string;
// };

// // Generate more data for testing
// const data: User[] = Array.from({ length: 20 }, (_, i) => ({
//   id: i + 1,
//   name: `User ${i + 1}`,
//   email: `user${i + 1}@test.com`,
// }));

// const columnHelper = createColumnHelper<User>();

// const columns = [
//   columnHelper.accessor('name', {
//     header: 'Name',
//     cell: (info) => info.getValue(),
//   }),
//   columnHelper.accessor('email', {
//     header: 'Email',
//     cell: (info) => info.getValue(),
//   }),
// ];

// const TableSample = () => {
//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   return (
//     <div className="p-4">
//       <table className="w-full border border-gray-300">
//         <thead className="bg-gray-100">
//           {table.getHeaderGroups().map((headerGroup) => (
//             <tr key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <th key={header.id} className="p-2 border">
//                   {header.isPlaceholder
//                     ? null
//                     : flexRender(
//                         header.column.columnDef.header,
//                         header.getContext()
//                       )}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>

//         <tbody>
//           {table.getRowModel().rows.map((row) => (
//             <tr key={row.id} className="hover:bg-gray-50">
//               {row.getVisibleCells().map((cell) => (
//                 <td key={cell.id} className="p-2 border">
//                   {flexRender(
//                     cell.column.columnDef.cell,
//                     cell.getContext()
//                   )}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Pagination Controls */}
//       <div className="flex items-center justify-between mt-4">
//         <button
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Prev
//         </button>

//         <span>
//           Page {table.getState().pagination.pageIndex + 1} of{' '}
//           {table.getPageCount()}
//         </span>

//         <button
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TableSample;

import { axiosInstance } from '@/app/api/axios';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';

type Tenant = {
  id: string;
  name: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
};

const columnHelper = createColumnHelper<Tenant>();




const TableSample = () => {

  const [data, setData] = useState<Tenant[]>([])

  const handleToggleBlock = async (id: string) => {
    await axiosInstance.patch(`http://localhost:3000/super-admin/tenants/${id}/toggle-block`);
    setData(prev => prev.map(t => t.id === id ? { ...t, isBlocked: !t.isBlocked } : t));
  };

  const handleEditName = async (id: string, name: string) => {
    try {
      await axiosInstance.patch(`http://localhost:3000/tenant/update/${id}`, { name })
      setData(prev => prev.map(t => t.id === id ? { ...t, name } : t));
    } catch (error) {
      console.log(error)
    }
  }

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('isBlocked', {
      header: 'Is Blocked',
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? "True" : "False"
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: ({ getValue }) => {
        const value = getValue();
        return new Date(value).toLocaleDateString();
      },
    }),
    columnHelper.accessor('updatedAt', {
      header: 'Updated At',
      cell: ({ getValue }) => {
        const value = getValue();
        return new Date(value).toLocaleDateString();
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const tenant = row.original; // This gives you access to the full Tenant object

        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleToggleBlock(tenant.id)}
              className={`px-3 py-1 rounded text-white text-sm font-medium ${tenant.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
            >
              {tenant.isBlocked ? 'Unblock' : 'Block'}
            </button>

            <button
              onClick={() => handleEditName(tenant.id, "aaaa")}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              Edit
            </button>
          </div>
        );
      },
    }),
  ];

  useEffect(() => {
    async function getData() {
      const res = await axiosInstance.get("http://localhost:3000/tenant/get-all")
      setData(res.data?.data)
    }

    getData()
  }, [])
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200 border-2">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((item) => {
            return (
              <tr key={item.id} className="divide-x border-2">
                {item.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-700"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  );
                })}{' '}
              </tr>
            );
          })}
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id} className="divide-x border-2">
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableSample;
