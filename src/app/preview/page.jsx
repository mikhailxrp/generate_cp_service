"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/header/Header";
import CpBlockOne from "@/components/preview-components/CpBlockOne";

function PreviewContent() {
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

export default function Prewiev() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
