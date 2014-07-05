//var pandaAddress = "D7ALhFR4mZ4FcKL3r3vjA8BrqX9aGCut4g";

var permanentStorage = window.localStorage;
var pandaAddress = window.localStorage.getItem("panda");

if (pandaAddress == ""){pandaAddress = "";}

$('#pandaForm').val(pandaAddress);

$('#sInfo').show();
$('#xInfo').hide();
$('#wInfo').hide();

$('#sButton').click(function(){
    $('#sInfo').show();
    $('#xInfo').hide();
    $('#wInfo').hide();
});

$('#xButton').click(function(){
    $('#sInfo').hide();
    $('#xInfo').show();
    $('#wInfo').hide();
});

$('#wButton').click(function(){
    $('#sInfo').hide();
    $('#xInfo').hide();
    $('#wInfo').show();
});

$('#updateButton').click(function(){
        pandaAddress = $('#pandaForm').val();
        window.localStorage.setItem("panda", pandaAddress);
        updateScrypt();
        updateX11();
        updateWallet();
});

var currentRound = 0;
var dogeBTCrate = 0;
var btcUSDprice = 0;
var dogeThousand = 0;
var addressBalance = 0;

updateScrypt();
updateX11();
updateWallet();

function updateScrypt(){

$('#sHash').html('Loading...');
$('#sDPD').html('');
$('#sPPD').html('');
$('#sPayouts').html('');

var url = "http://multi.pandapool.info/api.php?q=userinfo&user=" + pandaAddress;

$.ajax({
    url: url,
    dataType: 'json',
    success: function(results){

        if(results.result != "")
        {
            var totalHash = 0;
            for(var i = 0; i < results.result.workers.length;i++)
            {
                totalHash += parseInt(results.result.workers[i][2]);
            }
            $('#sHash').html(totalHash + " KH/s");

            currentRound = results.result.history[0].round;
            getDogePerDay(currentRound);

            var payoutHTML = "";
            if(pandaAddress.charAt(0) == "P"){
                for(var i = 0; i < 6; i++){
                    payoutHTML += "<div>Round " + results.result.history[i].round + " - " + roundToTwo(results.result.history[i].payout) + " Panda</div>";
                }
            }

            else{
                for(var i = 0; i < 6; i++){
                    payoutHTML += "<div>Round " + results.result.history[i].round + " - " + roundToTwo(results.result.history[i].payout) + " Doge</div>";
                }
            }

            $('#sPayouts').html(payoutHTML);
        }
    }
    });
}

function updateX11(){

$('#xHash').html('Loading...');
$('#xDPD').html('');
$('#xPPD').html('');
$('#xPayouts').html('');

var url = "http://multi.pandapool.info/api.php?q=userinfo&user=" + pandaAddress + "&algo=x11";

$.ajax({
    url: url,
    dataType: 'json',
    success: function(results){

        if(results.result != "")
        {
            var totalHash;
            for(var i = 0; i < results.result.workers.length;i++)
            {
                totalHash += parseInt(results.result.workers[i][2]);
            }
            $('#xHash').html(totalHash + " KH/s");

            var currentRound2 = results.result.history[0].round;
            getDogePerDayX(currentRound2);
            var payoutHTMLX = "";

            if(pandaAddress.charAt(0) == "P"){
                for(var i = 0; i < 6; i++){
                    payoutHTMLX += "<div>Round " + results.results.history[i].round + " - " + roundToTwo(results.result.history[i].payout) + " Panda</div>";
                }
            }

            else{
                for(var i = 0; i < 6; i++){
                    payoutHTMLX += "<div>Round " + results.results.history[i].round + " - " + roundToTwo(results.result.history[i].payout) + " Doge</div>";
                }
            }

            $('#xPayouts').html(payoutHTMLX);
        }

        else{
            $('#xHash').html('No data (0.00KH/s)');
        }
    }
    });
}

function updateWallet(){
    if(pandaAddress.charAt(0) == "P"){
        $('#dogeBTC').html("Error: Panda address");
    }

    else{
        $('#dogeBTC').html("Loading...");
        
        var url4 = 'http://pubapi.cryptsy.com/api.php?method=singlemarketdata&marketid=132';
        url4 = encodeURIComponent(url4);
        url4 = 'http://jsonp.guffa.com/Proxy.ashx?url=' + url4;
        $.ajax({
        url: url4,
        dataType: 'jsonp',
        success: function(results){
        dogeBTCrate = results.return.markets.DOGE.lasttradeprice;

        var url5 = 'coinbase.com/api/v1/currencies/exchange_rates';
        url5 = encodeURIComponent(url5);
        url5 = 'http://jsonp.guffa.com/Proxy.ashx?url=' + url5;

            $.ajax({
            url: url5,
            dataType: 'jsonp',
            success: function(data){
                btcUSDprice = data.btc_to_usd;
                btcUSDprice = roundToTwo(btcUSDprice);
                dogeThousand = dogeBTCrate * btcUSDprice;
                $('#dogeBTC').html(Math.ceil(dogeBTCrate*100000000) +" Satoshi");
                $('#dogeUSD').html("$" + roundToThree(dogeBTCrate * 1000 * btcUSDprice));
                getDogeAd(dogeBTCrate,btcUSDprice);
                
            }   
            });
        }   
        });

    }
}

function getDogeAd(dogeBTCrate,btcUSDprice){
    $.ajax({
    url: 'https://chain.so/api/v2/get_address_balance/DOGE/' + pandaAddress,
    dataType: 'jsonp',
    success: function(results){
        addressBalance = results.data.confirmed_balance;
        $('#dogeAm').html(roundToTwo(addressBalance) + " Doge");
        $('#usdAm').html("$" + roundToTwo(dogeBTCrate * btcUSDprice * addressBalance));
    }
    });

}

function getDogePerDay(cRound){
    var url2 = 'http://multi.pandapool.info/api.php?q=roundinfo&round=' + cRound;

    $.ajax({
        url: url2,
        dataType: 'json',
        success: function(results){
            $('#sDPD').html(roundToTwo(results.result.doge_mhs_day) + " Doge");
            $('#sPPD').html(roundToTwo(results.result.pnd_mhs_day) + " Panda");
        }
    });
}

function getDogePerDayX(cRound){
    var url2 = 'http://multi.pandapool.info/api.php?q=roundinfo&round=' + cRound + "&algo=x11";

    $.ajax({
        url: url2,
        dataType: 'json',
        success: function(results){
            $('#xDPD').html(roundToTwo(results.result.doge_mhs_day) + " Doge");
            $('#xPPD').html(roundToTwo(results.result.pnd_mhs_day) + " Panda");
        }
    });
}

//Rounding
function roundToTwo(num) { return +(Math.round(num + "e+2")  + "e-2"); }
function roundToThree(num) { return +(Math.round(num + "e+3")  + "e-3"); }
function roundToSix(num) { return +(Math.round(num + "e+6")  + "e-6"); }
function roundToEight(num) { return +(Math.round(num + "e+8")  + "e-8"); }