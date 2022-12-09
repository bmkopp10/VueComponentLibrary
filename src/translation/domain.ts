export type DomainTranslation = {
    location: string;
    status: string;
    carrier: string;
    trailer: string;
    supplier: string;
    transactions: string;
    cycleCount: string;
    inventory: string;
    needBy: string;
    shortName: string;
    name: string;
    quantityOnHand: string;
    palletQty: string;
    quantity: string;
    totalPlannedContainers: string;
    totalContainers: string;
    toLocation: string;
    fromLocation: string;
    actualQuantity: string;
    plannedQuantity: string;
    receivedQuantity: string;
    direction: string;
    placementDate: string;
    deliveryDate: string;
    outbound: string;
    inbound: string;
    transactionNumber: string;
    shipDate: string;
    carrierReferenceNumber: string;
    supplierReferenceNumber: string;
    plannedDeliveryDate: string;
    licensePlateNumber: string;
    trailerType: string;
    trailerNumber: string;
    disputeNotes: string;
    transactionItems: string;
    containerNumber: string;
    cycleCountReport: string;
    containerName: string;
    dateCounted: string;
    newCount: string;
    systemCount: string;
    variance: string;
    adjustmentQuantity: string;
    count: string;
    locationType: string;
    dueDate: string;
    totalItems: string;
    totalCounted: string;
    percentComplete: string;
    adjustmentAvailableCount: string;
};

const domainEn: DomainTranslation = {
    location: 'location',
    status: 'status',
    carrier: 'carrier',
    trailer: 'trailer',
    supplier: 'supplier',
    transactions: 'transactions',
    cycleCount: 'cycle count',
    inventory: 'inventory',
    needBy: 'need by',
    shortName: 'short name',
    name: 'name',
    quantityOnHand: 'quantity on hand',
    palletQty: 'pallet quantity',
    quantity: 'quantity',
    totalPlannedContainers: 'total planned containers',
    totalContainers: 'total containers',
    toLocation: 'to location',
    fromLocation: 'from location',
    actualQuantity: 'actual quantity',
    plannedQuantity: 'planned quantity',
    receivedQuantity: 'received quantity',
    direction: 'direction',
    transactionNumber: 'transaction number',
    placementDate: 'placement date',
    deliveryDate: 'delivery date',
    outbound: 'outbound',
    inbound: 'inbound',
    shipDate: 'ship date',
    carrierReferenceNumber: 'carrier reference number',
    supplierReferenceNumber: 'supplier reference number',
    plannedDeliveryDate: 'planned delivery date',
    licensePlateNumber: 'license plate number',
    trailerNumber: 'trailer number',
    trailerType: 'trailer type',
    disputeNotes: 'dispute notes',
    transactionItems: 'transaction items',
    containerNumber: 'item number',
    containerName: 'container name',
    cycleCountReport: 'cycle count report',
    dateCounted: 'date counted',
    newCount: 'new count',
    systemCount: 'system count',
    variance: 'variance',
    adjustmentQuantity: 'adjustment quantity',
    count: 'count',
    locationType: 'location type',
    dueDate: 'due date',
    totalItems: 'total items',
    totalCounted: 'total counted',
    percentComplete: 'percent complete',
    adjustmentAvailableCount: 'adjustments available',
};

const domainEs: DomainTranslation = {
    location: 'ubicación',
    status: 'estado',
    carrier: 'transportista',
    trailer: 'trailer',
    supplier: 'proveedor',
    transactions: 'transacciones',
    cycleCount: 'contador de cíclos',
    inventory: 'inventario',
    needBy: 'fecha del requerimiento',
    shortName: 'nombre corto',
    name: 'nombre',
    quantityOnHand: 'cantidad actual',
    palletQty: 'cantidad de palets',
    quantity: 'cantidad',
    totalPlannedContainers: 'total de contenedores planificados',
    totalContainers: 'total de contenedores',
    toLocation: 'a la ubicación',
    fromLocation: 'desde la ubicación',
    actualQuantity: 'cantidad actual',
    plannedQuantity: 'cantidad planificada',
    receivedQuantity: 'cantidad recibida',
    direction: 'dirección',
    transactionNumber: 'número de transacción',
    placementDate: 'fecha de colocación',
    deliveryDate: 'fecha de entrega',
    outbound: 'salidas',
    inbound: 'entradas',
    shipDate: 'fecha de envío',
    carrierReferenceNumber: 'número de referencia del transportista',
    supplierReferenceNumber: 'número de referencia del proveedor',
    plannedDeliveryDate: 'fecha de entrega planificada',
    licensePlateNumber: 'numero de licencia',
    trailerNumber: 'número de trailer',
    trailerType: 'tipo de trailer',
    disputeNotes: 'notas de disputa',
    transactionItems: 'artículos de transacción',
    containerNumber: 'número de artículo',
    cycleCountReport: 'reporte de conteo de ciclos',
    containerName: 'nombre del contenedor',
    dateCounted: 'fecha contada',
    newCount: 'nuevo conteo',
    systemCount: 'conteo de sistema',
    variance: 'diferencia',
    adjustmentQuantity: 'ajuste de cantidad',
    count: 'conteo',
    locationType: 'tipo de ubicacion',
    dueDate: 'fecha de vencimiento',
    totalItems: 'total de artículos',
    totalCounted: 'total contados',
    percentComplete: 'porcentaje completo',
    adjustmentAvailableCount: 'ajustes disponibles',
};

export { domainEn, domainEs };
