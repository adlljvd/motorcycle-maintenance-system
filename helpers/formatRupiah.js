function formatRupiah(valuation){
    return `Rp. ${Number(valuation).toLocaleString('id-ID')}` 
}

module.exports = formatRupiah