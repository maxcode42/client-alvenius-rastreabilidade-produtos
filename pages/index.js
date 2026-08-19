import withAuth from "../auth/auth-with";

// import HomeButtons from "./home-buttons";
import HomeModal from "./home-modal";

function Home() {
  // const typeMenuModal = true;

  // return typeMenuModal ? <HomeModal /> : <HomeButtons />;

  return <HomeModal />;
}

export default withAuth(Home);
