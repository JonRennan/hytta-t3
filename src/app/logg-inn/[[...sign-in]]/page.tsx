import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="mt-16 flex justify-center">
      <SignIn />
    </div>
  );
}
