export default function Home() {
  return (
    <div className="h-screen w-screen">
      <div className="flex justify-center text-3xl min-h-[60px]">Navbar</div>
      <div className="flex w-screen h-full gap-2 items-center">
        <div className="w-2/5 h-full ml-4 mb-4 bg-black rounded-lg"></div>
        <div className="w-3/5 h-full mr-4 mb-4 bg-black rounded-lg"></div>
      </div>
    </div>
  );
}
