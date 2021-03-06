import { Box } from "@mui/material";
import Link from "next/link";
import { DefaultLayout } from "../src/layout";

export default function Resume(): JSX.Element {
  return (
    <DefaultLayout
      head={"resume"}
      gridSizes={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
    >
      <Box height="100vh" width="97vw">
        <object
          data="/my-resume/resume_cv.pdf"
          type="application/pdf"
          style={{ width: "100%", height: "100%" }}
        >
          <div>
            No online PDF viewer installed. You can download my resume
            <Link href={`/my-resume/resume_cv.pdf`}>
              <a> here.</a>
            </Link>
          </div>
        </object>
      </Box>
    </DefaultLayout>
  );
}
