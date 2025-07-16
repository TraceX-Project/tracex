import { env } from "@/shared/config/env";

export default function HomePage() {
  return (
    <div>
      <h1>Hello WOrld</h1>
      <p>{env.NEXT_PUBLIC_API_URL}</p>
    </div>
  );
}
