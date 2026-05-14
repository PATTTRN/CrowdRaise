import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
    // Your application logic to authenticate the user
    // For example, you can check if the user is logged in or has the necessary permissions

    const { token, expire, signature } = getUploadAuthParams({
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, 
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
    })

    return Response.json({ 
      token, 
      expire, 
      signature, 
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY 
    })
}
