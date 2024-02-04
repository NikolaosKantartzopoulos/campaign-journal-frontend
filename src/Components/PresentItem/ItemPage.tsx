import { Box, Card, Paper, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import LoadingSpinner from "../CustomComponents/LoadingSpinner";
import ItemImageBox from "./ItemImage";
import { FlexBox } from "../CustomComponents/FlexBox";

interface ItemPageProps<T> {
  itemImage: string;
  queryKey: any[];
  queryFn: () => Promise<T>;
  itemSubtitle: keyof T | string; // Updated the type of itemSubtitle
  itemName: keyof T;
  prependString?: string; // New prop to prepend a string to the value
  children?: React.ReactNode;
  altText: string;
  descriptionText?: keyof T;
  CardChildren?: ReactNode;
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
  descriptionText,
  CardChildren,
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
  const showDescription =
    descriptionText &&
    item.hasOwnProperty(descriptionText) &&
    (item[descriptionText] as string)
      ? true
      : false;

  if (!item[itemName]) {
    router.push("/");
  }

  return (
    <>
      <FlexBox sx={{ justifyContent: "stretch", flexDirection: "column" }}>
        <FlexBox
          sx={{
            margin: "auto",
            p: 1,
            width: "100%",
            alignItems: "stretch",
            justifyContent: "space-between",
            flex: "1 1 0",
          }}
        >
          <Card sx={{ width: "100%", height: "100%", p: 1 }}>
            <Typography variant="h4">{item[itemName] as string}</Typography>
            <Typography
              variant="caption"
              sx={(theme) => ({ color: theme.palette.text.secondary })}
            >
              {typeof itemSubtitle === "string"
                ? getNestedValue(item, itemSubtitle)
                : (item[itemSubtitle] as React.ReactNode)}
            </Typography>
            {CardChildren}
          </Card>
          <Box>
            {itemImageUrl && (
              <ItemImageBox imageFile={itemImageUrl} altText={altText} />
            )}
          </Box>
        </FlexBox>
      </FlexBox>

      {showDescription && descriptionText && (
        <Box sx={{ m: 1 }}>
          <Paper
            elevation={5}
            sx={{ p: 2, maxHeight: "300px", overflow: "auto" }}
          >
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {item[descriptionText] as string}
            </Typography>
          </Paper>
        </Box>
      )}
      <Box>{children}</Box>
    </>
  );
};

export default ItemPage;
