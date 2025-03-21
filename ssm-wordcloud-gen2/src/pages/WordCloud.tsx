import WordCloudComponent from "../components/WordCloud.tsx";

export default function WordCloud() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f7f7f7',
    }}>
      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#000',
      }}>What others have said</h1>
      <WordCloudComponent />
    </div>
  );
}
