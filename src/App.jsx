import { useSelector } from "react-redux";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <main>
      <div>
        <h1>DevHub</h1>
        <p>
          {isAuthenticated
            ? `Signed in as ${user?.username || user?.fullName || "developer"}`
            : "Redux store is ready. Build login/register next."}
        </p>
      </div>
    </main>
  );
}

export default App;
