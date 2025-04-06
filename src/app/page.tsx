import Spline from "@splinetool/react-spline/next";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="h-screen w-screen relative">
        <div className="absolute top-10 left-10 text-white flex flex-col space-y-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-100">
              James Minton
            </h1>
            <h2 className="text-xl font-light text-gray-300 mt-1">
              Lead Software Developer
            </h2>
          </div>
          <div className="text-sm font-light text-gray-400 opacity-75">
            Website Under Maintenance
          </div>
        </div>
        <div className="absolute bottom-5 right-50 text-white text-sm font-light opacity-50">
          © {new Date().getFullYear()} James Minton
        </div>
        <div className="absolute bottom-2 right-0 w-44 h-12 bg-black"></div>
        {/* Robot but a bit too heavy :( */}
        {/* <Spline scene="https://prod.spline.design/tYReF9nGNM1CsFws/scene.splinecode" /> */}
        <Spline scene="https://prod.spline.design/yCxlO0OBTATa2Ti7/scene.splinecode" />{" "}
      </div>
    </main>
  );
}
