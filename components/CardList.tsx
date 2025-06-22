import {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
  } from "@/components/ui/table"

    import Link from "next/link";
    import Image from "next/image";
import { cn, getSubjectColor } from "@/lib/utils";

 
  interface CardListProps {
    cards?: Card[]
  }


const CardList = ({cards}:CardListProps) => {
    return (
        <article >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-lg w-1/3">The card</TableHead>
                        <TableHead className="text-lg w-2/3">Details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cards?.map(({name, image, meaning, reversedMeaning}) => (
                        <TableRow key={name}>
                            <TableCell className="w=1/3 flex-wrap">
                                <div className="flex items-start rounded-lg" >
                                <Image
                                    src={`${image}`}
                                    alt={name}
                                    width={200}
                                    height={350} />
                                </div>
                            </TableCell>
                            <TableCell className="w-2/3 align-top">
                                <div className="subject-badge w-fit ">
                                    {name}
                                </div>
                                <br/>
                                <p className="text-sm text-wrap">
                                        {meaning}</p>
                                <br/>
                                <p className="text-sm text-wrap">
                                {reversedMeaning}</p>

                            </TableCell>
                        </TableRow>
                    ))
                }


                </TableBody>
                <TableFooter />
                </Table>
        </article>

    )
  }
  
  export default CardList