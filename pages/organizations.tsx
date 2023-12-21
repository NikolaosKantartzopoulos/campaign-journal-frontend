import { GetServerSideProps } from "next";

const Organizations = () => {
	return <h3>Organizations</h3>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	return {
		props: {},
	};
};

export default Organizations;
