export type CommonTranslation = {
    selectCurrentLocation: string;
    selectLocation: string;
    loading: string;
    changeLocation: string;
    changeLanguage: string;
    about: string;
    logOff: string;
    selected: string;
    typeToSearch: string;
    reporting: string;
    emptyTable: string;
    trailerSpaceUtilized: string;
    trailerWeightUtilized: string;
    areYouSure: string;
    planning: string;
    quantityCannotBeLess: string;
    clearLocationWarning: string;
    alreadyAdded: string;
    allUnsavedDataWillBeLost: string;
    noItemsFound: string;
    requestedQuantityRoundedUp: string;
    unableToFindCycleCount: string;
    contactInformationNotFound: string;
    closed: string;
    awaitingApproval: string;
    cycleCountDashboard: string;
    dashboard: string;
    complete: string;
    allCycleCountsComplete: string;
    itemHasAlreadyBeenCounted: string;
    mustEnterCount: string;
    transactionsInDeliveryConfirmedStatus: string;
    waitForPreviousCountToFinishSaving: string;
    cycleCountReview: string;
    flag: string;
    from: string;
    to: string;
    search: string;
};

const commonEn: CommonTranslation = {
    about: 'about',
    logOff: 'log off',
    selectCurrentLocation: 'select current location',
    selectLocation: 'select location',
    loading: 'loading',
    changeLocation: 'change location',
    changeLanguage: 'change language',
    selected: 'selected',
    typeToSearch: 'type to search',
    reporting: 'reporting',
    emptyTable: 'no table data',
    trailerSpaceUtilized: 'trailer space utilized',
    trailerWeightUtilized: 'trailer weight utilized',
    areYouSure: 'are you sure?',
    planning: 'planning',
    quantityCannotBeLess: 'quantity cannot be less than total tags scanned for this item',
    clearLocationWarning: 'clearing location will clear all item quantities',
    alreadyAdded: 'already added',
    allUnsavedDataWillBeLost: 'all unsaved data will be lost',
    noItemsFound: 'no items found',
    requestedQuantityRoundedUp: 'requested, rounded up to nearest pallet quantity',
    unableToFindCycleCount: 'unable to find cycle count',
    contactInformationNotFound: 'no contact information found',
    closed: 'closed',
    awaitingApproval: 'awaiting approval',
    cycleCountDashboard: 'cycle count dashboard',
    dashboard: 'dashboard',
    complete: 'complete',
    allCycleCountsComplete: 'you have no cycle counts to complete at this time',
    itemHasAlreadyBeenCounted: 'item has already been counted',
    mustEnterCount: 'you must enter a value for count first',
    transactionsInDeliveryConfirmedStatus: 'you have transactions in Delivery Confirmed Status for this item',
    waitForPreviousCountToFinishSaving: 'please wait for the previous count to finish saving',
    cycleCountReview: 'cycle count review',
    flag: 'flag',
    from: 'from',
    to: 'to',
    search: 'search',
};

const commonEs: CommonTranslation = {
    about: 'acerca de',
    changeLocation: 'cambiar locación',
    changeLanguage: 'cambiar idioma',
    logOff: 'finalizar la sesión',
    selectCurrentLocation: 'seleccione la ubicación actual',
    selectLocation: 'seleccionar ubicación',
    loading: 'cargando',
    selected: 'seleccionado',
    typeToSearch: 'escribe para buscar',
    reporting: 'reportes',
    emptyTable: 'sin datos de tabla',
    trailerSpaceUtilized: 'espacio de remolque utilizado',
    trailerWeightUtilized: 'peso de trailer utilizado',
    areYouSure: 'estas seguro?',
    planning: 'planificación',
    quantityCannotBeLess: 'la cantidad no puede ser inferior al total de etiquetas escaneadas para este artículo',
    clearLocationWarning: 'al borrar la ubicación se borrarán todas las cantidades de este artículo',
    alreadyAdded: 'ya agregado',
    allUnsavedDataWillBeLost: 'todos los datos no guardados se perderán',
    noItemsFound: 'No se encontraron artículos',
    requestedQuantityRoundedUp: 'solicitado, redondeado a la cantidad de paleta más cercana',
    unableToFindCycleCount: 'incapaz de encontrar el número de ciclos',
    contactInformationNotFound: 'no se encontró información de contacto',
    closed: 'cerrado',
    awaitingApproval: 'esperando aprobacion',
    cycleCountDashboard: 'tablero de conteo de ciclos',
    dashboard: 'tablero',
    complete: 'completo',
    allCycleCountsComplete: 'no tiene conteo de ciclos para completar en este momento',
    itemHasAlreadyBeenCounted: 'los artículos ya han sido contados',
    mustEnterCount: 'primero debe ingresar un valor para contar',
    transactionsInDeliveryConfirmedStatus: 'usted tiene transacciones en el Status de Entrega Confirmada para este artículo',
    waitForPreviousCountToFinishSaving: 'ePor favor espere a que el conteo anterior termine de guardarse',
    cycleCountReview: 'revisión del conteo de ciclos',
    flag: 'bandera',
    from: 'de',
    to: 'a',
    search: 'búsqueda',
};

export { commonEn, commonEs };
