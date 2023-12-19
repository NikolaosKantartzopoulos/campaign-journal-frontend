import { GetServerSideProps } from "next";

const Character = () => {
	return <div>Character</div>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	return {
		props: {},
	};
};

export default Character;
