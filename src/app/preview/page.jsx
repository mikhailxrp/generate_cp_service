"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/components/header/Header";
import CpBlockOne from "@/components/preview-components/CpBlockOne";

export default function Prewiev() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  console.log(id);

  return (
    <>
      <Header />
      <div className="container">
        <div className="row justify-content-center mt-4">
          <div className="col-lg-10">
            <CpBlockOne />
          </div>
        </div>
      </div>
    </>
  );
}
