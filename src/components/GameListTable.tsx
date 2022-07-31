import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {useState} from 'react';
import {GameInformation} from '../schema/gameInformation';
import Link from "next/link";
import {db} from "../firebase";

/**
 * The table of the started games that the user can join.
 */
export const GameListTable = () => {

    const [gameList, setGameList] = useState<GameInformation[]>([]);

    function computeTimeDifferenceMinutes(date1: number, date2: number): number {
        const difference = date2 - date1; // This will give difference in milliseconds
        return Math.round(difference / 60000);
    }


    /**
     * Query all games already started.
     */
    const getGamesStarted = () => {
        db.collection("games").where("status", "==", "waiting").orderBy('gameCreatedAt', 'desc').limit(15)
            .get()
            .then((querySnapshot: any) => {
                const dateNow = Date.now();
                const gameListFb: GameInformation[] = querySnapshot.docs.map((doc: any) => ({
                    gameId: doc.id,
                    gameCreatedAt: computeTimeDifferenceMinutes(doc.data().gameCreatedAt || dateNow, dateNow),
                    status: doc.data().status
                }));
                setGameList(gameListFb);
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    return (
        <>
            <button
                className="cursor-pointer py-2 px-4 rounded transition text-center text-white-500 bg-square-black text-m mt-2 mb-2"
                onClick={() => getGamesStarted()}>
                Refresh Games
            </button>

            <Table aria-label="simple table" style={{ width: 600 }}>
                <TableHead style={{ color: "white", backgroundColor: "#f0d9b5" }}>
                    <TableRow>
                        <TableCell>Game ID</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Join Game</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {gameList.map((row: GameInformation) => (
                        <TableRow
                            key={row.gameId}
                        >
                            <TableCell>
                                {row.gameId}
                            </TableCell>
                            <TableCell>{row.gameCreatedAt} min ago</TableCell>
                            <TableCell>Waiting</TableCell>
                            <TableCell>
                                <Link href={`/game/${row.gameId}`} passHref>
                                    <button
                                        className="cursor-pointer py-1 px-4 rounded transition text-center text-white bg-square-black text-xl w-18 disabled:opacity-30"
                                    >Join
                            </button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}
