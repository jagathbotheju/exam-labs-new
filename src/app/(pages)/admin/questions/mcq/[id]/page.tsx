import AddMcqQuestion from "@/components/questions/AddMcqQuestion";

const QuestionDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div className="flex flex-col w-full gap-2">
      <AddMcqQuestion questionId={id} />;
    </div>
  );
};
export default QuestionDetailsPage;
