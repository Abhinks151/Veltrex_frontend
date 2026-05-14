import { useEffect } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface EditNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title?: string;
  defaultValue?: string;
  loading?: boolean;
}

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long"),
});

type FormData = z.infer<typeof schema>;

const EditNameModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Edit Name",
  defaultValue = "",
  loading = false,
}: EditNameModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValue,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ name: defaultValue });
    }
  }, [isOpen, defaultValue, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

        <form
          onSubmit={handleSubmit((data) => onSubmit(data.name))}
          className="space-y-3"
        >
          <div>
            <Input
              {...register("name")}
              placeholder="Enter name"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNameModal;