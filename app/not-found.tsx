import Link from "next/link";

const NotFound = () => {
  return (
    <div>
      <div className="mt-40 ml-190 text-center bg-red-700 py-3 w-90">
        <h1>404 !!! Page Not Found !!!</h1>
      </div>
      <div className="mt-40 ml-190 text-center bg-blue-950 py-3 w-90">
        <Link href="/" className="text-white mt-4 rounded-sm">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
