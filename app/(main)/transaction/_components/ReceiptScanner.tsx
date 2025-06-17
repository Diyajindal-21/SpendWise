"use client";

import { scanRecipt } from "@/actions/transaction";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { Camera, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

type ScanResult = {
  amount?: number;
  date?: Date;
  description?: string;
  merchantName?: string;
  category?: string;
  error?: string;
};

const ReceiptScanner = ({
  onScanComplete,
}: {
  onScanComplete: (data: ScanResult) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scannedData,
  } = useFetch(scanRecipt);

  const handleReceiptScan = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }
    await scanReceiptFn(file);
  };

  useEffect(() => {
    if (!scanReceiptLoading && scannedData) {
      if (scannedData.error) {
        toast.error(scannedData.error);
      } else {
        onScanComplete(scannedData);
        toast.success("Receipt scanned successfully");
      }
    }
  }, [scannedData, scanReceiptLoading]);

  return (
    <div>
  <input
    type="file"
    ref={fileInputRef}
    className="hidden"
    accept="image/*"
    capture="environment"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) handleReceiptScan(file);
    }}
  />
  <Button
    type="button"
    variant="outline"
    className="w-full h-10 bg-gradient-to-br from-[#5f5fff] to-[#38bdf8] text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
    onClick={() => fileInputRef.current?.click()}
    disabled={scanReceiptLoading}
  >
    {scanReceiptLoading ? (
      <>
        <Loader2 className="animate-spin mr-2 h-5 w-5" />
        <span>Scanning Receipt...</span>
      </>
    ) : (
      <>
        <Camera className="mr-2 h-5 w-5" />
        <span>Scan Receipt with AI</span>
      </>
    )}
  </Button>
</div>

  );
};

export default ReceiptScanner;
