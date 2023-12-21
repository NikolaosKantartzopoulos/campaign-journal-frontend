import { GetServerSideProps } from "next";

const Locations = () => {
	return <h3>Quests</h3>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	return {
		props: {},
	};
};

export default Locations;
