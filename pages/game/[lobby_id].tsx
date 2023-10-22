import { useRouter } from "next/router";

export default function Home() {
    // get the lobby id from the url
    const router = useRouter();
    const { lobby_id } = router.query;
    
    return (<p>{lobby_id}</p>);
}
