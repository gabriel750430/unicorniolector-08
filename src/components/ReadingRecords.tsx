
import React from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReadingRecord } from "@/types";

interface ReadingRecordsProps {
  records: ReadingRecord[];
}

const ReadingRecords: React.FC<ReadingRecordsProps> = ({ records }) => {
  // Exit early if no records
  if (records.length === 0) {
    return (
      <Card className="w-full max-w-3xl p-6 mt-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Registros de Lectura</h2>
        <p className="text-center text-muted-foreground py-4">
          No hay registros de lectura guardados.
        </p>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl p-6 mt-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Registros de Lectura</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>PPM</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.time}</TableCell>
                <TableCell>{record.wpm}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default ReadingRecords;
