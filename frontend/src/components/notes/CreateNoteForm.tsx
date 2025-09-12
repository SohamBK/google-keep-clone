import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppSelector } from "../../hooks/reduxHooks";
import { selectNotes } from "../../store/notes/notesSlice";

// Define the validation schema for the create note form
const createNoteFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(100, "Title cannot exceed 100 characters."),
  content: z.string().optional(),
});

// Infer the type from the schema for type-safe form data
export type CreateNoteFormInputs = z.infer<typeof createNoteFormSchema>;

interface CreateNoteFormProps {
  onFormSubmit: SubmitHandler<CreateNoteFormInputs>;
  onClose: () => void;
}

const CreateNoteForm: React.FC<CreateNoteFormProps> = ({
  onFormSubmit,
  onClose,
}) => {
  const { isLoading } = useAppSelector(selectNotes);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateNoteFormInputs>({
    resolver: zodResolver(createNoteFormSchema),
  });

  useEffect(() => {
    if (!isLoading) {
      reset(); // Clear the form on successful submission or when modal closes
    }
  }, [isLoading, reset]);

  return (
    <div className="p-4 rounded-lg shadow-lg bg-white">
      <div className="flex justify-end">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <input
            {...register("title")}
            type="text"
            placeholder="Title"
            className={`w-full p-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <div>
          <textarea
            {...register("content")}
            placeholder="Take a note..."
            rows={4}
            className={`w-full p-2 border rounded-md focus:outline-none text-black focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
              errors.content ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded-md font-semibold text-white transition-colors duration-200 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Creating..." : "Create Note"}
        </button>
      </form>
    </div>
  );
};

export default CreateNoteForm;
