import EditorComponent from "@/components/editorTab";

export default function Home() {
  return (
<<<<<<< HEAD
    <div className="flex flex-col justify-center align-center items-center h-screen w-screen py-4 gap-4">
      <div className="text-5xl text-black font-extrabold font-metal">
        RUNTIME
      </div>  
      
      <div className="relative ">
        <div className="rounded-full border border-black" style={{ width: '120px', height:'12px' }}>
          <div className="flex h-6 w-48 items-center justify-center rounded-full bg-black text-xs leading-none" style={{ width: '50%', height: '100%' }}>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          {/* <div className="h-8 w-8 rounded-full bg-red-500"></div> */}
        </div>
      </div>    
      
=======
    <div className="h-screen w-screen">
      <div className="flex justify-center text-3xl min-h-[100px] text-sc-yellow font-extrabold font-mono pt-3 font-monda">
        King of the Heap
      </div>
>>>>>>> 67183ea840344501be78da24b4f4ebc7a8e480d4
      <div className="flex w-screen h-full gap-2 items-center">
        <div className="w-2/5 h-full ml-4 mb-4 bg-sc-darkpurple rounded-lg"></div>
        <div className="flex flex-col gap-4 w-3/5 h-full mb-4 rounded-lg">
          <EditorComponent />
        </div>
      </div>

    </div>
  );
}
