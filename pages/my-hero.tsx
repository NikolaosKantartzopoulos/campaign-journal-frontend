import { GetServerSideProps } from "next";

const MyHero = () => {
	return <h3>My Hero</h3>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	return {
		props: {},
	};
};

export default MyHero;
