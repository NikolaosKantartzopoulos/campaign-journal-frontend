import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import LoadingSpinner from "../CustomComponents/LoadingSpinner";
import ItemImageBox from "./ItemImage";

interface ItemPageProps<T> {
  itemImage: string;
  queryKey: any[];
  queryFn: () => Promise<T>;
  itemSubtitle: keyof T | string; // Updated the type of itemSubtitle
  itemName: keyof T;
  prependString?: string; // New prop to prepend a string to the value
  children?: React.ReactNode;
  altText: string;
}

const ItemPage = <T,>({
  itemImage,
  queryKey,
  queryFn,
  itemSubtitle,
  itemName,
  prependString = "", // Default to an empty string
  children,
  altText,
}: ItemPageProps<T>) => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const itemImageUrl = itemImage ? `data:image/png;base64,${itemImage}` : null;

  const { data: item, isFetching } = useQuery<T>({
    queryKey,
    queryFn,
    enabled: !!user,
  });

  if (isFetching || !item) {
    return <LoadingSpinner />;
  }

  const getNestedValue = (obj: any, path: string) => {
    const properties = path.split(".");
    const nestedValue = properties.reduce((acc, prop) => acc[prop], obj);

    return prependString + nestedValue;
  };

  return (
    <Box sx={{ m: 1, p: 1 }}>
      <Box>
        <Typography variant="h5">{item[itemName] as string}</Typography>
        <Typography
          variant="caption"
          sx={(theme) => ({ color: theme.palette.text.secondary })}
        >
          {typeof itemSubtitle === "string"
            ? getNestedValue(item, itemSubtitle)
            : (item[itemSubtitle] as React.ReactNode)}
        </Typography>
      </Box>
      {itemImageUrl && (
        <ItemImageBox imageFile={itemImageUrl} altText={altText} />
      )}
      <Box>{children}</Box>
    </Box>
  );
};

export default ItemPage;
