import WordCloudComponent from "@/components/WordCloud";

export default function WordCloud() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-black">What others have said</h1>
      <WordCloudComponent />
    </div>
  );
}
