// import Image from "next/image";
// import { ImageResponse } from "next/og";
// // import { NextRequest } from "next/server";

// export async function GET() {
//   return new ImageResponse(
//     (
//       <div tw="w-full h-full flex flex-col justify-end bg-slate-200">
//         <div>
//           <Image
//             src="https://res.cloudinary.com/flameit/image/upload/v1739565980/FlameIt_ozvqyt.png"
//             alt="og image"
//           />
//         </div>
//         <div tw="bg-white p-8">
//           <h1 tw="text-xl">FlameIt.</h1>
//         </div>
//       </div>
//     ),
//     {
//       width: 1200,
//       height: 630,
//     }
//   );
// }

import { ImageResponse } from "next/og";
// App router includes @vercel/og.
// No need to install it.

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: "black",
          background: "white",
          width: "100%",
          height: "100%",
          padding: "50px 200px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <h1 tw="text-4xl">🔥FlameIt.</h1> */}
        {/* <img
          src={
            "https://res.cloudinary.com/flameit/image/upload/v1739565980/FlameIt_ozvqyt.png"
          }
          alt="og image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
          }}
        /> */}
        FlameIt.
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
