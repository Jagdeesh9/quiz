const Loader = ({ size = "w-10 h-10", color = "border-blue-500" }) => {
    return (
      <div className="flex justify-center items-center h-full">
        <div
          className={`border-4 border-t-transparent ${color} rounded-full animate-spin ${size}`}
        ></div>
      </div>
    );
  };
  
  export default Loader;
  