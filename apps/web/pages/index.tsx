import axios from 'axios';

type Message = {
  id: number;
  name: string; //"Second one";
  createdAt: string; //"2022-09-24T10:29:00.842Z"
  updatedAt: string; //"2022-09-24T10:29:00.843Z"
};

type Props = {
  messages: Message[];
};

export async function getStaticProps() {
  const { data } = await axios('http://localhost:8080/entities/');
  return { props: { messages: data } };
}

export default function Web({ messages }: Props) {
  return (
    <div>
      {messages.length > 0 &&
        messages.map((message, idx) => {
          return <div key={idx}>{message.name}</div>;
        })}
    </div>
  );
}
