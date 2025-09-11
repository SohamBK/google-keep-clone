import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { createNote, selectNotes } from "../../store/notes/notesSlice";

// Define the validation schema for the create note form
const createNoteFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(100, "Title cannot exceed 100 characters."),
  content: z.string().optional(),
});

// Infer the type from the schema for type-safe form data
type CreateNoteFormInputs = z.infer<typeof createNoteFormSchema>;

const CreateNoteForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(selectNotes);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateNoteFormInputs>({
    resolver: zodResolver(createNoteFormSchema),
  });

  const onSubmit: SubmitHandler<CreateNoteFormInputs> = async (data) => {
    try {
      await dispatch(createNote(data)).unwrap();
      reset(); // Clear the form on successful submission
    } catch (error) {
      // Error handling is managed by the Redux slice
      console.error("Failed to create note:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mb-8 p-4 rounded-lg shadow-lg bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("title")}
            type="text"
            placeholder="Title"
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
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
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
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
