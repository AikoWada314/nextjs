import type { UseFormReturn } from 'react-hook-form'

export type CategoryFormValues = { name: string };
interface Props {
  mode: "new" | "edit";
  form: UseFormReturn<CategoryFormValues>;
  onSubmit: (values: CategoryFormValues) => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export const CategoryForm: React.FC<Props> = ({
  form,
  mode,
  onSubmit,
  onDelete,
  isLoading = false,
}) => {
  const { register, handleSubmit, formState: { errors } } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          カテゴリー名
        </label>
        <input
          type="text"
          id="title"
          {...register("name", { required: "カテゴリー名は必須です" })}
          disabled={isLoading}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
        {errors.name?.message && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={isLoading}
      >
        {mode === "new" ? "作成" : "更新"}
      </button>
      {mode === "edit" && (
        <button
          type="button"
          disabled={isLoading}
          className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2"
          onClick={onDelete}
        >
          {isLoading ? "処理中..." : "削除"}
        </button>
      )}
    </form>
  );
};
