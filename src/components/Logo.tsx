import Image from "next/image";
import { APP_NAME } from "@/lib/copy";

export function Logo({
  className = "h-8 w-auto",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/Jobcific-logo.png"
      alt={APP_NAME}
      width={879}
      height={219}
      className={className}
      priority={priority}
    />
  );
}
