import Header from "@/app/(root)/_components/Header";
import { SignedIn, SignedOut, SignOutButton, SignUpButton } from "@clerk/nextjs";
import OutputPanel from "./_components/OutputPanel";
import EditorPanel from "./_components/EditorPanel";

export default function page() {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1800px] mx-auto p-4">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditorPanel/>
          <OutputPanel/>

          
        </div>
      </div>
      
    </div>
  )
}
