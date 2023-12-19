import { useWithAuth } from "@/Components/Authentication/useWithAuth";
import { GetServerSideProps } from "next";

const Character = () => {
	useWithAuth();
	return <div>Character</div>;
};

export const getServerSideProps = (async (ctx) => {
	// Fetch data from external API
	// Pass data to the page via props
	return { props: {} };
}) satisfies GetServerSideProps;

export default Character;
