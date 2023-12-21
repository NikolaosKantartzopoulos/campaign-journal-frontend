import { useWithAuth } from "@/Components/Authentication/useWithAuth";
import { GetServerSideProps } from "next";

const Characters = () => {
	useWithAuth();
	return <h3>Characters</h3>;
};

export const getServerSideProps = (async (ctx) => {
	// Fetch data from external API
	// Pass data to the page via props
	return { props: {} };
}) satisfies GetServerSideProps;

export default Characters;
