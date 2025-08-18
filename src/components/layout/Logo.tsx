import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={cn("text-primary", className)}
      fill="currentColor"
    >
      <path
        d="M232,88.4a54.3,54.3,0,0,0-79.6-4.2L128,108.6,103.6,84.2a54.3,54.3,0,0,0-79.6,4.2,54.3,54.3,0,0,0,4.2,79.6L112,180.1V224a8,8,0,0,0,16,0V180.1l83.8-87.9A54.3,54.3,0,0,0,232,88.4ZM184,136H160a8,8,0,0,0,0,16h24v24a8,8,0,0,0,16,0V152h24a8,8,0,0,0,0-16H200V112a8,8,0,0,0-16,0Z"
      />
    </svg>
  );
}
