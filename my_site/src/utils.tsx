import { Box, CircularProgress } from "@mui/material";

export async function fetcher(
  url: string,
  requestInit: RequestInit | undefined
): Promise<unknown> {
  const res = await fetch(url, requestInit);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    // Attach extra info to the error object.
    const info = await res.json();

    const error = new Error(
      `An error occurred while fetching the data. Status: ${res.status}, Message: ${info}`
    );

    throw error;
  }

  console.log(`STATUS: ${res.status}`);

  return res.json();
}

export function LoadingCircle(): JSX.Element {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="50vh"
    >
      <CircularProgress disableShrink={true} size={70} />
    </Box>
  );
}
