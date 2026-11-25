export interface Quote {
  id: string;
  name: string;
  buy: number;
  sell: number;
  source: string;
  updatedAt: string;
}

// Referencia para generar fechas ficticias al cargar el módulo.
// No representa una consulta a un proveedor.
const mockReferenceTime = Date.now();

function minutesAgo(minutes: number): string {
  return new Date(
    mockReferenceTime - minutes * 60_000
  ).toISOString();
}

export const quotesMock: Quote[] = [
  {
    id: "official",
    name: "Dólar oficial",
    buy: 1180,
    sell: 1220,
    source: "DolarAPI · ejemplo",
    updatedAt: minutesAgo(5),
  },
  {
    id: "mep",
    name: "Dólar MEP",
    buy: 1235,
    sell: 1245,
    source: "DolarAPI · ejemplo",
    updatedAt: minutesAgo(3),
  },
  {
    id: "blue",
    name: "Dólar blue",
    buy: 1250,
    sell: 1270,
    source: "DolarAPI · ejemplo",
    updatedAt: minutesAgo(8),
  },
  {
    id: "crypto",
    name: "Dólar cripto",
    buy: 1248,
    sell: 1262,
    source: "DolarAPI · ejemplo",
    updatedAt: minutesAgo(2),
  },
];