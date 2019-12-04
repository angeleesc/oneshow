<?php

use App\Models\MongoDB\Cliente;
use App\Models\MongoDB\ClienteDireccion;
use App\Models\MongoDB\ClienteSucursalFavorito;
use App\Models\MongoDB\ClienteVehiculo;
use App\Models\MongoDB\Cobranza;
use App\Models\MongoDB\Color;
use App\Models\MongoDB\Empresa;
use App\Models\MongoDB\EstatusPedido;
use App\Models\MongoDB\Evento;
use App\Models\MongoDB\MarcaVehiculo;
use App\Models\MongoDB\ModeloVehiculo;
use App\Models\MongoDB\Pais;
use App\Models\MongoDB\Producto;
use App\Models\MongoDB\Sucursal;
use App\Models\MongoDB\Venta;
use Carbon\Carbon;
use MongoDB\BSON\ObjectId;

function formatText($string)
{

    if (valueNull($string)) {
        return null;
    } else {
        return strtoupper(unaccent(trim($string)));
    }

}

function formatTextFirstCharacterToUpper($string)
{

    if (valueNull($string)) {
        return null;
    } else {
        return title_case(strtolower(unaccent(trim($string))));
    }

}

function formatPorcent($number)
{

    if (valueNull($number)) {
        return null;
    } else {
        return strtoupper(number_format((float) trim($number), 0, '.', '') . '%');
    }

}

function valueNull($string)
{

    $text = trim((is_null($string) || empty($string) ? null : $string));

    if ($text) {
        return false;
    } else {
        return true;
    }

}

function clean($text)
{

    $utf8 = array(
        '/[áàâãªä]/u' => 'a',
        '/[ÁÀÂÃÄ]/u' => 'A',
        '/[ÍÌÎÏ]/u' => 'I',
        '/[íìîï]/u' => 'i',
        '/[éèêë]/u' => 'e',
        '/[ÉÈÊË]/u' => 'E',
        '/[óòôõºö]/u' => 'o',
        '/[ÓÒÔÕÖ]/u' => 'O',
        '/[úùûü]/u' => 'u',
        '/[ÚÙÛÜ]/u' => 'U',
        '/ç/' => 'c',
        '/Ç/' => 'C',
        '/ñ/' => 'n',
        '/Ñ/' => 'N',
        '/–/' => '-', // UTF-8 hyphen to "normal" hyphen
        '/[’‘‹›‚]/u' => ' ', // Literally a single quote
        '/[“”«»„]/u' => ' ', // Double quote
        '/ /' => ' ', // nonbreaking space (equiv. to 0x160)
    );

    return preg_replace(array_keys($utf8), array_values($utf8), $text);
}

function unaccent($string)
{

    $string = trim($string);

    $string = str_replace(
        array('á', 'à', 'ä', 'â', 'ª', 'Á', 'À', 'Â', 'Ä'),
        array('a', 'a', 'a', 'a', 'a', 'A', 'A', 'A', 'A'),
        $string
    );

    $string = str_replace(
        array('é', 'è', 'ë', 'ê', 'É', 'È', 'Ê', 'Ë'),
        array('e', 'e', 'e', 'e', 'E', 'E', 'E', 'E'),
        $string
    );

    $string = str_replace(
        array('í', 'ì', 'ï', 'î', 'Í', 'Ì', 'Ï', 'Î'),
        array('i', 'i', 'i', 'i', 'I', 'I', 'I', 'I'),
        $string
    );

    $string = str_replace(
        array('ó', 'ò', 'ö', 'ô', 'Ó', 'Ò', 'Ö', 'Ô'),
        array('o', 'o', 'o', 'o', 'O', 'O', 'O', 'O'),
        $string
    );

    $string = str_replace(
        array('ú', 'ù', 'ü', 'û', 'Ú', 'Ù', 'Û', 'Ü'),
        array('u', 'u', 'u', 'u', 'U', 'U', 'U', 'U'),
        $string
    );

    $string = str_replace(
        array('ç', 'Ç'),
        array('c', 'C'),
        $string
    );

    $string = str_replace(
        array('ñ', 'Ñ'),
        array('Ñ', 'Ñ'),
        $string
    );

    //Esta parte se encarga de eliminar cualquier caracter extraño
    /*$string = str_replace(
    array("\\", "¨", "º", "-", "~",
    "#", "@", "|", "!", "\"",
    "·", "$", "%", "&", "/",
    "(", ")", "?", "'", "¡",
    "¿", "[", "^", "`", "]",
    "+", "}", "{", "¨", "´",
    ">", "< ", ";", ",", ":",
    ".", " "),
    '',
    $string
    );*/

    return $string;

}

function getValueThroughKeyFromObject($key, $object)
{

    $keys = explode('.', $key);

    if (count($keys) > 1) {

        $temp = $keys[0];

        if (isset($object->$temp)) {

            unset($keys[0]);

            $newKeys = implode('.', $keys);

            if (gettype($object->$temp) === 'array') {

                return getValueThroughKeyFromArray($newKeys, $object->$temp);
            }

            if (gettype($object->$temp) === 'object') {

                return getValueThroughKeyFromObject($newKeys, $object->$temp);
            }

        } else {
            return false;
        }

    } else {

        if (isset($object->$key)) {

            return $object->$key;

        } else {
            return false;
        }
    }
}

function getValueThroughKeyFromArray($key, $array)
{

    $keys = explode('.', $key);

    if (count($keys) > 1) {
        $temp = $keys[0];

        if (isset($array[$temp])) {
            unset($keys[0]);

            $newKeys = implode('.', $keys);

            if (gettype($array[$temp]) === 'array') {
                return getValueThroughKeyFromArray($newKeys, $array[$temp]);
            }

            if (gettype($array[$temp]) === 'object') {
                return getValueThroughKeyFromObject($newKeys, $array[$temp]);
            }
        } else {
            return false;
        }
    } else {
        if (isset($array[$key])) {
            return $array[$key];
        } else {
            return false;
        }
    }
}

function isInTheList($list, $item)
{

    foreach ($list as $key) {
        if ($key === $item) {
            return true;
        }
    }

    return false;
}

function formatDni($data)
{

    $pre = explode('-', $data);
    return strtoupper(implode('', $pre));
}

function humanFileSize($size, $precision = 2)
{
    $units = array('B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
    $step = 1024;
    $i = 0;

    while (($size / $step) > 0.9) {
        $size = $size / $step;
        $i++;
    }

    return round($size, $precision) . $units[$i];
}

function group_by($key, $data)
{

    $result = array();

    foreach ($data as $val) {
        if (array_key_exists($key, $val)) {
            $result[$val[$key]][] = $val;
        } else {
            $result[""][] = $val;
        }
    }

    ksort($result);

    return $result;
}

function showLogistica($logisticas)
{

    $log = [];

    foreach ($logisticas as $l) {

        $log[] = \App\Models\MongoDB\Logistica::find((string) $l)->Nombre;
    }

    sort($log);

    return implode('/', $log);

}

function regresarStock($productos)
{

    if ($productos) {

        foreach ($productos as $pro) {

            $cantidad = 0;
            $productoDB = '';
            $productoid = '';

            $productoid = (string) $pro['productoid'];
            $cantidad = (int) $pro['cantidad'];

            $productoDB = Producto::find($productoid);
            $productoDB->Stock = (string) (((int) $productoDB->Stock) + ($cantidad));
            $productoDB->save();

        }

        return true;

    }

    return false;

}

function restarStock($productos)
{

    if ($productos) {

        foreach ($productos as $pro) {

            $cantidad = 0;
            $productoDB = '';
            $productoid = '';

            $productoid = (string) $pro['productoid'];
            $cantidad = (int) $pro['cantidad'];

            $productoDB = Producto::find($productoid);
            $productoDB->Stock = (string) (((int) $productoDB->Stock) - ($cantidad));
            $productoDB->save();

        }

        return true;

    }

    return false;

}

function clonarVentaCancelacion($pedido)
{

    $p = Venta::find($pedido);
    $importe = (float) $p->ImporteTotal;
    $new = $p->replicate();
    $new->ImporteTotal = (float) ($importe * -1);

    if ($new->save()) {
        return true;
    } else {
        return false;
    }

}

function regresarPagoMP($orden, $pedido)
{

    $venta = Venta::find($pedido);
    $empresaid = (string) $venta->Empresa_id;
    $sucursalid = (string) $venta->Sucursal_id;
    $payment_id = $venta->PagoIDMercadoPago;

    $credencialesMP = getAccessTokenMercadoPago($empresaid, $sucursalid);

    //obtengo la url de la api de mercado pag
    $mercadopago_url_api = config('app.mercado-pago-url-api');

    try {

        $client = new \GuzzleHttp\Client();
        $response = $client->request('POST', $mercadopago_url_api . '/payments/' . $payment_id . '/refunds', [
            'query' => [
                'access_token' => $credencialesMP['accessToken'],
            ],
        ]);

    } catch (\GuzzleHttp\Exception\ClientException $e) {

        return ['exito' => false, 'msj' => 'fallido'];
    }

    //dd($response);

    return ['exito' => true, 'msj' => 'exito'];

}

function regresarPago($orden, $pedido)
{

    //obtengo la url de la api transbank
    $transbank_url = config('app.transbank-url');

    $client = new \GuzzleHttp\Client();
    $response = $client->request('POST', $transbank_url . '/reverse', [
        'form_params' => [
            'comercio' => getIDComercioTransbank($pedido),
            'orden' => $orden,
            'tipo' => getTipoTransbank($pedido),
        ],
    ]);

    $response = $response->getBody()->getContents();

    $result = json_decode($response);

    if ($result->code == 200) {

        return ['exito' => true, 'msj' => 'exito'];

    } else {

        return ['exito' => false, 'msj' => 'Error al procesar reversa del dinero. Consulte al administrador.'];

    }

}

function getTipoTransbank($pedido)
{

    $venta = Venta::find($pedido);
    $empresaid = $venta->Empresa_id;
    $sucursalid = $venta->Sucursal_id;

    $emp = \App\Models\MongoDB\Empresa::find($empresaid);
    $suc = \App\Models\MongoDB\Sucursal::find($sucursalid);

    if ((!empty($suc->CodigoComercioProductivo)) and (!empty($suc->PrivateKey)) and (!empty($suc->PublicKey))) {
        return 's';
    } else if ((!empty($emp->CodigoComercioProductivo)) and (!empty($emp->PrivateKey)) and (!empty($emp->PublicKey))) {
        return 'e';
    } else {
        return 'e';
    }

}

function getIDComercioTransbank($pedido)
{

    $venta = Venta::find($pedido);
    $empresaid = $venta->Empresa_id;
    $sucursalid = $venta->Sucursal_id;

    $emp = \App\Models\MongoDB\Empresa::find($empresaid);
    $suc = \App\Models\MongoDB\Sucursal::find($sucursalid);

    if ((!empty($suc->CodigoComercioProductivo)) and (!empty($suc->PrivateKey)) and (!empty($suc->PublicKey))) {
        return (string) $sucursalid;
    } else if ((!empty($emp->CodigoComercioProductivo)) and (!empty($emp->PrivateKey)) and (!empty($emp->PublicKey))) {
        return (string) $empresaid;
    } else {
        return (string) $empresaid;
    }

}

function getCredencialesMercadoPago($empresa, $sucursal)
{

    $empresaid = $empresa;
    $sucursalid = $sucursal;

    $emp = \App\Models\MongoDB\Empresa::find($empresaid);
    $suc = \App\Models\MongoDB\Sucursal::find($sucursalid);

    if ((!empty($suc->MercadoPagoSecretID)) and (!empty($suc->MercadoPagoClientID))) {

        return [
            'clientID' => $suc->MercadoPagoClientID,
            'secretID' => $suc->MercadoPagoSecretID,
        ];

    } else if ((!empty($emp->MercadoPagoSecretID)) and (!empty($emp->MercadoPagoClientID))) {

        return [
            'clientID' => $emp->MercadoPagoClientID,
            'secretID' => $emp->MercadoPagoSecretID,
        ];

    }

}

function getAccessTokenMercadoPago($empresa, $sucursal)
{

    $empresaid = $empresa;
    $sucursalid = $sucursal;

    $emp = \App\Models\MongoDB\Empresa::find($empresaid);
    $suc = \App\Models\MongoDB\Sucursal::find($sucursalid);

    if ((!empty($suc->MercadoPagoAccessToken))) {

        return [
            'accessToken' => $suc->MercadoPagoAccessToken,
        ];

    } else if ((!empty($emp->MercadoPagoAccessToken))) {

        return [
            'accessToken' => $emp->MercadoPagoAccessToken,
        ];

    }

}

function getGalleryImages($tipo)
{

    $result = [];

    $path = public_path('img/gallery/') . $tipo . '/';
    $dir = $path . '*';

    $searches = array(".jpg", ".png", ".jpeg", ".JPG", ".JPEG");
    $replaces = array("", "", "", "", "");

    foreach (glob($dir) as $file) {

        if (!is_dir($file)) {

            $textImg = str_replace($searches, $replaces, basename($file));

            $result[] = [
                'id' => asset('img/gallery/' . $tipo . '/' . basename($file)),
                'text' => $textImg,
            ];

        }
    }

    return $result;
}

function compareByNombre($a, $b)
{
    return strcmp($a["Nombre"], $b["Nombre"]);
}

function dataMailPedido($pedido, $action)
{

    $p = Venta::find($pedido);

    if ($p) {

        $items = [];

        if ($p->Items) {

            foreach ($p->Items as $i) {

                $extras = [];

                if (!empty($i['extras'])) {

                    foreach ($i['extras'] as $e) {

                        $extras[] = [
                            'cantidad' => $e['cantidad'],
                            'precio' => $e['precio'],
                            'productoid' => Producto::find($e['producto'])->_id,
                            'producto' => Producto::find($e['producto'])->Nombre,
                            'idextrarandom' => str_random(20),
                        ];
                    }
                }

                $items[] = [
                    'cantidad' => $i['cantidad'],
                    'productoid' => $i['productoid'],
                    'producto' => Producto::find($i['productoid'])->Nombre,
                    'precioind' => $i['precioind'],
                    'preciototalsinextras' => $i['preciototalsinextras'],
                    'preciototalconextras' => $i['preciototalconextras'],
                    'precioextras' => $i['precioextras'],
                    'precioextra1' => $i['precioextra1'],
                    'precioextra2' => $i['precioextra2'],
                    'precioextra3' => $i['precioextra3'],
                    'aclaraciones' => $i['aclaraciones'],
                    'extras' => $extras,
                    'iditemrandom' => str_random(20),
                ];

            }

        }

        if ($action == 'cancelar') {
            $subject = 'Cancelación de Pedido';
        } else if ($action == 'entregar') {
            $subject = 'Entrega de Pedido';
        } else if ($action == 'pedir') {
            $subject = 'Orden de Pedido';
        }

        $precioenvio = empty($p->PrecioEnvio) ? '' : $p->PrecioEnvio;
        $motivoCancelacion = empty($p->MotivoCancelacion) ? '' : $p->MotivoCancelacion;

        if ($p->Logistica == 'delivery') {
            $subtotal = ((float) $p->ImporteTotal) - ((float) $precioenvio);
            $importeTotal = $p->ImporteTotal;
        } else {
            $subtotal = 0;
            $importeTotal = $p->ImporteTotal;
        }

        $pro = [];
        $cantProducto = count($items);

        for ($i = 0; $i < $cantProducto; $i++) {

            $list = [];

            if ($items[$i]['extras'] != '') {

                for ($j = 0; $j < count($items[$i]['extras']); $j++) {

                    $li = '<li>' . $items[$i]['extras'][$j]['cantidad'] . ' x ' . $items[$i]['extras'][$j]['producto'] . '</li>';

                    array_push($list, $li);
                }

                if ($list) {

                    $lis = '<li><span class="pro-text">' . $items[$i]['cantidad'] . ' x ' . $items[$i]['producto'] . '</span> &nbsp; <span class="badge badge-dark roboto-mono">' . $items[$i]['aclaraciones'] . '</span><ul class="sublist-producto">';
                    foreach ($list as $l) {
                        $lis .= $l;
                    }
                    $lis .= '</ul></li>';

                } else {
                    $lis = '<li><span class="pro-text">' . $items[$i]['cantidad'] . ' x ' . $items[$i]['producto'] . '</span> &nbsp; <span class="badge badge-dark roboto-mono">' . $items[$i]['aclaraciones'] . '</span><ul class="sublist-producto"></ul></li>';
                }

                array_push($pro, $lis);

            } else {

                $liss = '<li><span class="pro-text">' . $items[$i]['cantidad'] . ' x' . $items[$i]['producto'] . '</span> &nbsp; <span class="badge badge-dark">' . $items[$i]['aclaraciones'] . '</span></li>';
                array_push($pro, $liss);

            }

        }

        $result = [
            'id' => $p->_id,
            'subject' => $subject,
            'orden' => $p->NumeroOrden,
            'clienteid' => $p->Cliente_id,
            'clientenombre' => Cliente::find($p->Cliente_id)->Nombre . ' ' . Cliente::find($p->Cliente_id)->Apellido,
            'clientecorreo' => Cliente::find($p->Cliente_id)->Correo,
            'clientedireccion' => Cliente::find($p->Cliente_id)->Direccion,
            'clientetelefono' => Cliente::find($p->Cliente_id)->Telefono,
            'empresaid' => $p->Empresa_id,
            'empresa' => Empresa::find($p->Empresa_id)->Nombre,
            'empresacuitrut' => Empresa::find($p->Empresa_id)->Cuit_rut,
            'empresacorreo' => Empresa::find($p->Empresa_id)->Correo,
            'empresatelefono' => Empresa::find($p->Empresa_id)->Telefono,
            'empresadireccion' => Empresa::find($p->Empresa_id)->Direccion,
            'sucursalid' => $p->Sucursal_id,
            'sucursal' => Sucursal::find($p->Sucursal_id)->Nombre,
            'sucursaltelefono' => Sucursal::find($p->Sucursal_id)->Telefono,
            'sucursaldireccion' => Sucursal::find($p->Sucursal_id)->Direccion,
            'fechap' => $p->FechaPedido->format('Y-m-d H:i:s'),
            'fechapedido' => $p->FechaPedido->format('d/m/Y h:i A'),
            'fechacortapedido' => $p->FechaPedido->format('d/m/Y'),
            'horapedido' => $p->FechaPedido->format('h:i A'),
            'importetotal' => $importeTotal,
            'subtotal' => $subtotal,
            'formapago' => (string) $p->MetodoPago,
            'formapagonombre' => Cobranza::find($p->MetodoPago)->Nombre,
            'logistica' => $p->Logistica,
            'estado' => EstatusPedido::find($p->EstadoPedido)->Nombre,
            'color' => EstatusPedido::find($p->EstadoPedido)->Color,
            'precioenvio' => $precioenvio,
            'efectivopago' => isset($p->EfectivoPago) ? (float) $p->EfectivoPago : '',
            'direccionenviopais' => empty($p->DireccionEnvio) ? '' : ClienteDireccion::find($p->DireccionEnvio)->Pais,
            'direccionenviociudad' => empty($p->DireccionEnvio) ? '' : ClienteDireccion::find($p->DireccionEnvio)->Ciudad,
            'direccionenviocalle' => empty($p->DireccionEnvio) ? '' : ClienteDireccion::find($p->DireccionEnvio)->Calle,
            'direccionenviocomuna' => empty($p->DireccionEnvio) ? '' : ClienteDireccion::find($p->DireccionEnvio)->Comuna,
            'direccionenvionumero' => empty($p->DireccionEnvio) ? '' : ClienteDireccion::find($p->DireccionEnvio)->Numero,
            'direccionenviocasa' => empty($p->DireccionEnvio) ? '' : ClienteDireccion::find($p->DireccionEnvio)->CasaDepartamento,
            'vehiculotipo' => empty($p->Vehiculo) ? '' : ClienteVehiculo::find($p->Vehiculo)->Tipo,
            'vehiculomarca' => empty($p->Vehiculo) ? '' : MarcaVehiculo::find(ClienteVehiculo::find($p->Vehiculo)->Marca_id)->Marca,
            'vehiculomodelo' => empty($p->Vehiculo) ? '' : ModeloVehiculo::find(ClienteVehiculo::find($p->Vehiculo)->Modelo_id)->Modelo,
            'vehiculocolor' => empty($p->Vehiculo) ? '' : Color::find(ClienteVehiculo::find($p->Vehiculo)->Color_id)->Color,
            'vehiculopatente' => empty($p->Vehiculo) ? '' : ClienteVehiculo::find($p->Vehiculo)->Patente,
            'motivocancelacion' => $motivoCancelacion,
            'action' => $action,
            'items' => $items,
            'detalleitems' => $pro,

        ];

    }

    return $result;

}

function getDayOfWeek()
{

    $fechaActual = \Carbon\Carbon::now();
    $diaActual = $fechaActual->dayOfWeek;

    $dias = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ];

    return $dias[$diaActual];

}

function getDayOfWeekSpanish()
{

    $fechaActual = \Carbon\Carbon::now();
    $diaActual = $fechaActual->dayOfWeek;

    $dias = [
        'Domingo',
        'Lunes',
        'Martes',
        'Miercoles',
        'Jueves',
        'Viernes',
        'Sabado',
    ];

    return $dias[$diaActual];

}

function getHorarioActualSucursal($horarios)
{

    $dia = getDayOfWeek();

    $horario = $horarios[$dia];

    return ['apertura1' => $horario['apertura1'], 'cierre1' => $horario['cierre1'], 'apertura2' => $horario['apertura2'], 'cierre2' => $horario['cierre2']];

}

function getFormatedHorarioActualSucursal($horario)
{

    $result = '-';

    if ($horario['apertura1'] and $horario['cierre2']) {

        if ($horario['cierre1'] and $horario['apertura2']) {
            $result = $horario['apertura1'] . ' - ' . $horario['cierre1'] . ' / ' . $horario['apertura2'] . ' - ' . $horario['cierre2'];
        } else {
            $result = $horario['apertura1'] . ' - ' . $horario['cierre2'];
        }

    }

    return $result;

}

function generateAlertaMensaje($pedidoid, $tiponotificacion, $texto, $rol)
{

    $clienteid = Auth::user()->_id;

    $pedido = Venta::find($pedidoid);

    //procedo a guardarlos en la bd
    $registro = new \App\Models\MongoDB\Mensaje;
    $registro->Venta_id = new ObjectId($pedidoid);
    $registro->Cliente_id = new ObjectId($clienteid);
    $registro->Empresa_id = new ObjectId($pedido->Empresa_id);
    $registro->Sucursal_id = new ObjectId($pedido->Sucursal_id);
    $registro->TipoNotificacion_id = new ObjectId($tiponotificacion);
    $registro->TipoMensaje_id = new ObjectId("5c506b1382ead01ea4fce73a");
    $registro->Texto = $texto;
    $registro->Autor = $rol;
    $registro->FechaAlerta = Carbon::now();
    $registro->Borrado = false;
    $registro->Activo = true;
    $registro->Leido = true;

    //verifico si fue exitoso el insert en la bd
    if ($registro->save()) {

        //disparo evento
        event(new \App\Events\AlertaMensajeEvent($texto, (string) $pedido->Cliente_id, $rol, $pedidoid));

        return true;
    } else {
        return false;
    }
}
function generateAlertaMensajeSoporte($clienteid, $tiponotificacion, $texto, $rol)
{

    //procedo a guardarlos en la bd
    $registro = new \App\Models\MongoDB\MensajeSoporte;
    $registro->Cliente_id = new ObjectId($clienteid);
    $registro->TipoNotificacion_id = new ObjectId($tiponotificacion);
    $registro->TipoMensaje_id = new ObjectId("5c506b1382ead01ea4fce73a");
    $registro->Texto = $texto;
    $registro->Autor = $rol;
    $registro->FechaAlerta = Carbon::now();
    $registro->Borrado = false;
    $registro->Activo = true;
    $registro->Leido = true;

    //verifico si fue exitoso el insert en la bd
    if ($registro->save()) {

        //disparo evento
        event(new \App\Events\AlertaMensajeSoporteEvent($texto, (string) $clienteid, $rol, '', ''));

        return true;
    } else {
        return false;
    }

}
function removeUserVisitante($user)
{

    $cliente = Cliente::find($user);
    $cliente->delete();

    $clienteDir = ClienteDireccion::where('Cliente_id', new ObjectId($user))->delete();

    $clienteVeh = ClienteVehiculo::where('Cliente_id', new ObjectId($user))->delete();

    $clienteFav = ClienteSucursalFavorito::where('Cliente_id', new ObjectId($user))->delete();

}

function procesarItemsPedido($cart)
{

    $result = [];

    if ($cart) {

        //recorremos el carrito
        foreach ($cart as $value) {

            $unidadmedida = $value['unidadmedida'];

            if ($unidadmedida == '5c4871abb3d3f632dfef73fc') {
                $cant = (int) $value['productocantidad'];
            } else if ($unidadmedida == '5c48723ad5674c32df1b74ff') {
                $cant = $value['productocantidad'];
            } else if ($unidadmedida == '5c6482cade58c52f24306155') {
                $cant = $value['productocantidad'];
            }

            $extra1 = procesarProductoExtra($value['extra1'], $value['cant1']);
            $extra2 = procesarProductoExtra($value['extra2'], $value['cant2']);
            $extra3 = procesarProductoExtra($value['extra3'], $value['cant3']);

            $extras = array_merge($extra1, $extra2, $extra3);

            $result[] = [
                'cantidad' => $cant,
                'productoid' => new \MongoDB\BSON\ObjectId($value['productoid']),
                'precioind' => (float) $value['productoprecio'],
                'preciototalsinextras' => (float) $value['productoprecio'] * (float) $value['productocantidad'],
                'preciototalconextras' => (float) $value['productopreciototal'],
                'precioextras' => $value['productoprecioextras'],
                'precioextra1' => $value['precioextra1'],
                'precioextra2' => $value['precioextra2'],
                'precioextra3' => $value['precioextra3'],
                'aclaraciones' => $value['aclaraciones'],
                'extras' => $extras,
            ];
        }

    }

    //devuelvo el resultado en formato json
    return $result;

}

function procesarImporteTotal($productos)
{

    $sum = 0;

    if ($productos) {

        foreach ($productos as $pro) {
            $sum = (float) $sum + (float) $pro['preciototalconextras'];
        }
    }

    return $sum;

}

function procesarProductoExtra($extra, $cant)
{

    $result = [];

    if (!empty($extra)) {

        if (is_array($extra) and !empty($extra)) {

            foreach ($extra as $e) {

                $arr = explode("-", $e);

                $result[] = [
                    'cantidad' => (int) $cant,
                    'producto' => $arr[2],
                    'precio' => (float) $arr[4],
                ];

            }

        } else {

            $arr = explode("-", $extra);

            $result[] = [
                'cantidad' => (int) $cant,
                'producto' => $arr[2],
                'precio' => (float) $arr[4],
            ];
        }

    }

    return $result;

}

function createNumeroPedido()
{

    $fecha = Carbon::now();

    $year = substr($fecha->year, 2);
    $month = str_pad($fecha->month, 2, '0', STR_PAD_LEFT);
    $day = str_pad($fecha->day, 2, '0', STR_PAD_LEFT);
    $micro = str_pad($fecha->micro, 6, '0', STR_PAD_LEFT);

    return $year . $month . $day . $micro;

}

function deleteCamareroCart($mesa)
{

    $registro = \App\Models\MongoDB\MesaPedido::borrado(false)->activo(true)->where('Mesa_id', $mesa)->first();
    $registro->delete();

}

function generateRandomCode()
{

    $id = str_random(4);

    $validator = \Validator::make(['id' => $id], ['id' => 'unique:Mesas,QRCode']);

    if ($validator->fails()) {
        return generateRandomCode();
    }

    return strtoupper($id);
}

function procesarItemsPedidoCamarero($cart)
{

    $result = [];

    if ($cart) {

        //recorremos el carrito
        foreach ($cart as $value) {

            $unidadmedida = $value['unidadmedida'];

            if ($unidadmedida == '5c4871abb3d3f632dfef73fc') {
                $cant = (int) $value['productocantidad'];
            } else if ($unidadmedida == '5c48723ad5674c32df1b74ff') {
                $cant = $value['productocantidad'];
            } else if ($unidadmedida == '5c6482cade58c52f24306155') {
                $cant = $value['productocantidad'];
            }

            $extra1 = procesarProductoExtra($value['extra1'], $value['cant1']);
            $extra2 = procesarProductoExtra($value['extra2'], $value['cant2']);
            $extra3 = procesarProductoExtra($value['extra3'], $value['cant3']);

            $extras = array_merge($extra1, $extra2, $extra3);

            $result[] = [
                'cantidad' => $cant,
                'productoid' => new \MongoDB\BSON\ObjectId($value['productoid']),
                'precioind' => (float) $value['productoprecio'],
                'preciototalsinextras' => (float) $value['productoprecio'] * (float) $value['productocantidad'],
                'preciototalconextras' => (float) $value['productopreciototal'],
                'precioextras' => $value['productoprecioextras'],
                'precioextra1' => $value['precioextra1'],
                'precioextra2' => $value['precioextra2'],
                'precioextra3' => $value['precioextra3'],
                'aclaraciones' => $value['aclaraciones'],
                'extras' => $extras,
                'confirmacion' => $value['confirmacion'],
            ];
        }

    }

    //devuelvo el resultado en formato json
    return $result;

}

function cerrarMesaCamarero($mesa)
{

    $mp = \App\Models\MongoDB\MesaPedido::borrado(false)->activo(true)->where('Mesa_id', $mesa)->first();

    if ($mp) {

        removeReservaMesa($mesa);
        checkMesasEsclavo($mesa);
        deleteCamareroCart($mesa);
        changeEstatusMesa($mesa, '5c6f83e57ca6ef441b4b42c3');

    } else {
        changeEstatusMesa($mesa, '5c6f83e57ca6ef441b4b42c3');
    }

}

function closeMesaCamarero($mesa)
{

    $mp = \App\Models\MongoDB\MesaPedido::borrado(false)->activo(true)->where('Mesa_id', $mesa)->first();

    if ($mp) {
        return 1;
    } else {
        return 2;
    }

}

function changeEstatusMesa($mesa, $estatus)
{

    $registro = \App\Models\MongoDB\Mesa::find($mesa);
    $registro->EstadoMesa_id = new ObjectId($estatus);
    $registro->save();

}

function convertMinutesToSeconds($minutos)
{

    return (int) ($minutos * 60);

}

function isEnabledMesasReservas()
{

    $suc = null;

    //guardo el rol del usuario
    $rol = strtoupper(Auth::user()->nameRol());

    //verifico que tipo de datos voy a cargar acorde al rol
    if ($rol == 'ADMINISTRADOR' or $rol == 'SUPERVISOR') {

        $suc = Sucursal::borrado(false)->activo(true)
            ->where(function ($query) {
                $query->where('ReservaMesaPosdatada', true)->orWhere('ReservaMesaCurso', true);
            })->get();

    } else if ($rol == 'APODERADO') {

        $suc = Sucursal::borrado(false)->activo(true)
            ->where(function ($query) {
                $query->where('ReservaMesaPosdatada', true)->orWhere('ReservaMesaCurso', true);
            })->where('Empresa_id', Auth::user()->Empresa_id)->get();

    } else if ($rol == 'EMPRESA') {

        $suc = Sucursal::borrado(false)->activo(true)
            ->where(function ($query) {
                $query->where('ReservaMesaPosdatada', true)->orWhere('ReservaMesaCurso', true);
            })->where('Empresa_id', Auth::user()->Empresa_id)->get();

    } else if ($rol == 'SUCURSAL' or $rol == 'RECEPCIONISTA') {

        $suc = Sucursal::borrado(false)->activo(true)
            ->where(function ($query) {
                $query->where('ReservaMesaPosdatada', true)->orWhere('ReservaMesaCurso', true);
            })->where('_id', Auth::user()->Sucursal_id)->get();

    }

    if ($suc->isEmpty()) {
        return false;
    } else {
        return true;
    }

}

function getEmpresasMesasReservas()
{

    $suc = null;

    //guardo el rol del usuario
    $rol = strtoupper(Auth::user()->nameRol());

    //verifico que tipo de datos voy a cargar acorde al rol
    if ($rol == 'ADMINISTRADOR' or $rol == 'SUPERVISOR') {

        $suc = Sucursal::borrado(false)->activo(true)
            ->where(function ($query) {
                $query->where('ReservaMesaPosdatada', true)->orWhere('ReservaMesaCurso', true);
            })->get();

    } else if ($rol == 'APODERADO') {

        $suc = Sucursal::borrado(false)->activo(true)
            ->where(function ($query) {
                $query->where('ReservaMesaPosdatada', true)->orWhere('ReservaMesaCurso', true);
            })->where('Empresa_id', Auth::user()->Empresa_id)->get();

    } else if ($rol == 'EMPRESA') {

        $suc = Sucursal::borrado(false)->activo(true)
            ->where(function ($query) {
                $query->where('ReservaMesaPosdatada', true)->orWhere('ReservaMesaCurso', true);
            })->where('Empresa_id', Auth::user()->Empresa_id)->get();

    } else if ($rol == 'SUCURSAL' or $rol == 'RECEPCIONISTA') {

        $suc = Sucursal::borrado(false)->activo(true)
            ->where(function ($query) {
                $query->where('ReservaMesaPosdatada', true)->orWhere('ReservaMesaCurso', true);
            })->where('_id', Auth::user()->Sucursal_id)->get();

    }

    if ($suc->isEmpty()) {

        return '';

    } else {

        $temp = [];
        $temp2 = [];

        foreach ($suc as $s) {

            $arreglo = array(
                'empresa' => (string) $s->Empresa_id,
                'sucursal' => (string) $s->Sucursal_id,
            );

            $temp[] = $arreglo;
        }

        $empresasid = group_by('empresa', $temp);

        foreach ($empresasid as $key => $value) {

            $e = Empresa::find($key);

            $temp2[] = [
                'id' => (string) $e->_id,
                'empresa' => $e->Nombre,
            ];

        }

        return $temp2;

    }

}

function getSucursalesMesasReservas()
{

    $suc = null;

    //guardo el rol del usuario
    $rol = strtoupper(Auth::user()->nameRol());

    //verifico que tipo de datos voy a cargar acorde al rol
    if ($rol == 'ADMINISTRADOR' or $rol == 'SUPERVISOR') {

        $suc = Sucursal::borrado(false)->activo(true)
            ->where(function ($query) {
                $query->where('ReservaMesaPosdatada', true)->orWhere('ReservaMesaCurso', true);
            })->get();

    } else if ($rol == 'APODERADO') {

        $suc = Sucursal::borrado(false)->activo(true)
            ->where(function ($query) {
                $query->where('ReservaMesaPosdatada', true)->orWhere('ReservaMesaCurso', true);
            })->where('Empresa_id', Auth::user()->Empresa_id)->get();

    } else if ($rol == 'EMPRESA') {

        $suc = Sucursal::borrado(false)->activo(true)
            ->where(function ($query) {
                $query->where('ReservaMesaPosdatada', true)->orWhere('ReservaMesaCurso', true);
            })->where('Empresa_id', Auth::user()->Empresa_id)->get();

    } else if ($rol == 'SUCURSAL' or $rol == 'RECEPCIONISTA') {

        $suc = Sucursal::borrado(false)->activo(true)
            ->where(function ($query) {
                $query->where('ReservaMesaPosdatada', true)->orWhere('ReservaMesaCurso', true);
            })->where('_id', Auth::user()->Sucursal_id)->get();

    }

    if ($suc->isEmpty()) {

        return '';

    } else {

        $temp = [];

        foreach ($suc as $key) {

            $s = Sucursal::find($key->_id);

            $temp[] = [
                'id' => (string) $key->_id,
                'sucursal' => $key->Nombre,
            ];

        }

        return $temp;

    }

}

function getMesaSalonMR($sucursal)
{

    $mesas = \App\Models\MongoDB\Mesa::borrado(false)->activo(true)->where('Sucursal_id', new ObjectId($sucursal))->where('SectorMesa_id', new ObjectId('5c6f822f7ca6ef441b4b42bd'))->get();

    $result = [];

    if ($mesas) {

        foreach ($mesas as $m) {

            $timer = '0';
            $esclavos = [];
            $reservanombre = '';

            if ((string) $m->EstadoMesa_id == '5c6f83f67ca6ef441b4b42c4') {

                $mp = \App\Models\MongoDB\MesaPedido::where('Mesa_id', (string) $m->_id)->first();
                $timer = $mp->Creado->diffInMinutes();
            }

            if ((string) $m->EstadoMesa_id == '5c6f842c7ca6ef441b4b42c7') {

                $esclavos = generateEsclavos($m->Union);
            }

            if ((string) $m->EstadoMesa_id == '5c6f842c7ca6ef441b4b42c7' or (string) $m->EstadoMesa_id == '5c6f83f67ca6ef441b4b42c4') {

                if ($m->Reserva_id != null) {

                    $reser = \App\Models\MongoDB\Reserva::find($m->Reserva_id);
                    $manual = $reser->Manual;

                    if ($manual) {
                        $reservanombre = $reser->Nombre . ' ' . $reser->Apellido;
                    } else {
                        $reservanombre = Cliente::find($reser->Cliente_id)->Nombre . ' ' . Cliente::find($reser->Cliente_id)->Apellido;
                    }

                }
            }

            $result[] = [
                'id' => (string) $m->_id,
                'numero' => $m->Numero,
                'estatusid' => (string) $m->EstadoMesa_id,
                'estatus' => \App\Models\MongoDB\EstatusMesa::find($m->EstadoMesa_id)->Nombre,
                'comensales' => $m->NumeroComensales,
                'tipo' => \App\Models\MongoDB\TipoMesa::find($m->TipoMesa_id)->Nombre,
                'sector' => (string) $m->SectorMesa_id,
                'timer' => $timer . ' min',
                'esclavos' => $esclavos,
                'reservanombre' => $reservanombre,
                'reserva' => $reservanombre == '' ? false : true,
            ];

        }

    }

    return $result;

}

function getMesaAireMR($sucursal)
{

    $mesas = \App\Models\MongoDB\Mesa::borrado(false)->activo(true)->where('Sucursal_id', new ObjectId($sucursal))->where('SectorMesa_id', new ObjectId('5c6f82427ca6ef441b4b42be'))->get();

    $result = [];

    if ($mesas) {

        foreach ($mesas as $m) {

            $timer = '0';
            $esclavos = [];
            $reservanombre = '';

            if ((string) $m->EstadoMesa_id == '5c6f83f67ca6ef441b4b42c4') {

                $mp = \App\Models\MongoDB\MesaPedido::where('Mesa_id', (string) $m->_id)->first();
                $timer = $mp->Creado->diffInMinutes();
            }

            if ((string) $m->EstadoMesa_id == '5c6f842c7ca6ef441b4b42c7') {

                $esclavos = generateEsclavos($m->Union);
            }

            if ((string) $m->EstadoMesa_id == '5c6f842c7ca6ef441b4b42c7' or (string) $m->EstadoMesa_id == '5c6f83f67ca6ef441b4b42c4') {

                if ($m->Reserva_id != null) {

                    $reser = \App\Models\MongoDB\Reserva::find($m->Reserva_id);
                    $manual = $reser->Manual;

                    if ($manual) {
                        $reservanombre = $reser->Nombre . ' ' . $reser->Apellido;
                    } else {
                        $reservanombre = Cliente::find($reser->Cliente_id)->Nombre . ' ' . Cliente::find($reser->Cliente_id)->Apellido;
                    }

                }
            }

            $result[] = [
                'id' => (string) $m->_id,
                'numero' => $m->Numero,
                'estatusid' => (string) $m->EstadoMesa_id,
                'estatus' => \App\Models\MongoDB\EstatusMesa::find($m->EstadoMesa_id)->Nombre,
                'comensales' => $m->NumeroComensales,
                'tipo' => \App\Models\MongoDB\TipoMesa::find($m->TipoMesa_id)->Nombre,
                'sector' => (string) $m->SectorMesa_id,
                'timer' => $timer . ' min',
                'esclavos' => $esclavos,
                'reservanombre' => $reservanombre,
                'reserva' => $reservanombre == '' ? false : true,
            ];

        }

    }

    return $result;

}

function getSucursalesMR($empresa)
{

    $suc = Sucursal::borrado(false)->activo(true)
        ->where(function ($query) {
            $query->where('ReservaMesaPosdatada', true)->orWhere('ReservaMesaCurso', true);
        })->where('Empresa_id', new ObjectId($empresa))->get();

    $temp = [];

    if ($suc) {

        foreach ($suc as $key) {

            $s = Sucursal::find($key->_id);

            $temp[] = [
                'id' => (string) $key->_id,
                'sucursal' => $key->Nombre,
            ];

        }

        return $temp;

    } else {

        return $temp;

    }

}

function getEstatusMesaMR()
{

    $result = [];

    $estatus = \App\Models\MongoDB\EstatusMesa::borrado(false)->activo(true)->get();

    if ($estatus) {

        foreach ($estatus as $e) {

            if ((string) $e->_id != '5c6f84357ca6ef441b4b42c8') {

                $result[] = [
                    'id' => (string) $e->_id,
                    'estado' => $e->Nombre,
                ];

            }

        }

    }

    return $result;

}

function abrirMesa($mesa)
{

    $m = \App\Models\MongoDB\Mesa::find($mesa);

    $mp = \App\Models\MongoDB\MesaPedido::borrado(false)->activo(true)->where('Mesa_id', new ObjectId($mesa))->first();

    if ($mp) {
        return false;
    } else {

        $registro = new \App\Models\MongoDB\MesaPedido;
        $registro->Mesa_id = $mesa;
        $registro->Cliente_id = null;
        //$registro->FechaPedido = Carbon::now();
        $registro->Empresa_id = new ObjectId((string) $m->Empresa_id);
        $registro->Sucursal_id = new ObjectId((string) $m->Sucursal_id);
        $registro->Cart = null;
        $registro->Items = null;
        $registro->Empresa = null;
        $registro->Activo = true;
        $registro->Borrado = false;
        $registro->CodigoComensal = generateRandomCodeComensal();
        $registro->Compartido = null;

        if ($registro->save()) {

            changeEstatusMesa($m->_id, '5c6f83f67ca6ef441b4b42c4');

            return true;
        } else {
            return false;
        }

    }

}

function abrirMesaReserva($mesa, $cliente, $reserva)
{

    $m = \App\Models\MongoDB\Mesa::find($mesa);

    $mp = \App\Models\MongoDB\MesaPedido::borrado(false)->activo(true)->where('Mesa_id', new ObjectId($mesa))->first();

    if ($mp) {
        return false;
    } else {

        $registro = new \App\Models\MongoDB\MesaPedido;
        $registro->Mesa_id = $mesa;
        $registro->Cliente_id = $cliente == '' ? null : new ObjectId($cliente);
        //$registro->FechaPedido = Carbon::now();
        $registro->Empresa_id = new ObjectId((string) $m->Empresa_id);
        $registro->Sucursal_id = new ObjectId((string) $m->Sucursal_id);
        $registro->Cart = null;
        $registro->Items = null;
        $registro->Empresa = null;
        $registro->Activo = true;
        $registro->Borrado = false;
        $registro->CodigoComensal = generateRandomCodeComensal();
        $registro->Compartido = null;

        if ($registro->save()) {

            agregarReservaMesa($m->_id, $reserva);
            changeEstatusMesa($m->_id, '5c6f83f67ca6ef441b4b42c4');

            return true;
        } else {
            return false;
        }

    }

}

function abrirMesaMaestra($mesa)
{

    $m = \App\Models\MongoDB\Mesa::find($mesa);

    $mp = \App\Models\MongoDB\MesaPedido::borrado(false)->activo(true)->where('Mesa_id', new ObjectId($mesa))->first();

    if ($mp) {
        return false;
    } else {

        $registro = new \App\Models\MongoDB\MesaPedido;
        $registro->Mesa_id = $mesa;
        $registro->Cliente_id = null;
        //$registro->FechaPedido = Carbon::now();
        $registro->Empresa_id = new ObjectId((string) $m->Empresa_id);
        $registro->Sucursal_id = new ObjectId((string) $m->Sucursal_id);
        $registro->Cart = null;
        $registro->Items = null;
        $registro->Empresa = null;
        $registro->Activo = true;
        $registro->Borrado = false;
        $registro->CodigoComensal = generateRandomCodeComensal();
        $registro->Compartido = null;

        if ($registro->save()) {

            changeEstatusMesa($m->_id, '5c6f842c7ca6ef441b4b42c7');

            return true;
        } else {
            return false;
        }

    }

}

function abrirMesaMaestraReserva($mesa, $cliente, $reserva)
{

    $m = \App\Models\MongoDB\Mesa::find($mesa);

    $mp = \App\Models\MongoDB\MesaPedido::borrado(false)->activo(true)->where('Mesa_id', new ObjectId($mesa))->first();

    if ($mp) {
        return false;
    } else {

        $registro = new \App\Models\MongoDB\MesaPedido;
        $registro->Mesa_id = $mesa;
        $registro->Cliente_id = $cliente == '' ? null : new ObjectId($cliente);
        //$registro->FechaPedido = Carbon::now();
        $registro->Empresa_id = new ObjectId((string) $m->Empresa_id);
        $registro->Sucursal_id = new ObjectId((string) $m->Sucursal_id);
        $registro->Cart = null;
        $registro->Items = null;
        $registro->Empresa = null;
        $registro->Activo = true;
        $registro->Borrado = false;
        $registro->CodigoComensal = generateRandomCodeComensal();
        $registro->Compartido = null;

        if ($registro->save()) {

            agregarReservaMesa($m->_id, $reserva);
            changeEstatusMesa($m->_id, '5c6f842c7ca6ef441b4b42c7');

            return true;
        } else {
            return false;
        }

    }

}

function convertMesaMaestra($mesa, $mesas)
{

    $m = \App\Models\MongoDB\Mesa::find($mesa);

    $m->Union = processEsclavos($mesas);

    $change = setMesasEsclava($mesas);

    if ($m->save()) {

        abrirMesaMaestra((string) $m->_id);
        //changeEstatusMesa((string)$m->_id, '5c6f842c7ca6ef441b4b42c7');

        return true;
    } else {
        return false;
    }

}

function convertMesaMaestraReserva($mesa, $mesas, $cliente, $reserva)
{

    $m = \App\Models\MongoDB\Mesa::find($mesa);

    $m->Union = processEsclavos($mesas);

    $change = setMesasEsclava($mesas);

    if ($m->save()) {

        abrirMesaMaestraReserva((string) $m->_id, $cliente, $reserva);
        //changeEstatusMesa((string)$m->_id, '5c6f842c7ca6ef441b4b42c7');

        return true;
    } else {
        return false;
    }

}

function setMesasEsclava($mesas)
{

    foreach ($mesas as $m) {

        changeEstatusMesa($m, '5c6f84357ca6ef441b4b42c8');

    }

}

function processEsclavos($mesas)
{

    $result = [];

    if ($mesas) {

        foreach ($mesas as $m) {

            $result[] = $m;
        }

    }

    return $result;
}

function generateRandomCodeComensal()
{

    $id = str_random(4);

    $validator = \Validator::make(['id' => $id], ['id' => 'unique:MesasPedidos,CodigoComensal']);

    if ($validator->fails()) {
        return generateRandomCode();
    }

    return strtoupper($id);
}

function checkMesasEsclavo($mesa)
{

    $registro = \App\Models\MongoDB\Mesa::find($mesa);
    $esclavos = $registro->Union;

    if ($esclavos != null) {

        foreach ($esclavos as $m) {

            changeEstatusMesa($m, '5c6f83e57ca6ef441b4b42c3');
        }

    }

}

function generateEsclavos($esclavos)
{

    $result = [];

    if ($esclavos) {

        foreach ($esclavos as $m) {

            $result[] = \App\Models\MongoDB\Mesa::find($m)->Numero;
        }

    }

    return $result;

}

function getEmpresaSucursalMesasReservas()
{

    $suc = null;

    //guardo el rol del usuario
    $rol = strtoupper(Auth::user()->nameRol());

    //verifico que tipo de datos voy a cargar acorde al rol
    if ($rol == 'ADMINISTRADOR' or $rol == 'SUPERVISOR') {

        $suc = Sucursal::borrado(false)->activo(true)
            ->where(function ($query) {
                $query->where('ReservaMesaPosdatada', true)->orWhere('ReservaMesaCurso', true);
            })->first();

    } else if ($rol == 'APODERADO') {

        $suc = Sucursal::borrado(false)->activo(true)
            ->where(function ($query) {
                $query->where('ReservaMesaPosdatada', true)->orWhere('ReservaMesaCurso', true);
            })->where('Empresa_id', Auth::user()->Empresa_id)->first();

    } else if ($rol == 'EMPRESA') {

        $suc = Sucursal::borrado(false)->activo(true)
            ->where(function ($query) {
                $query->where('ReservaMesaPosdatada', true)->orWhere('ReservaMesaCurso', true);
            })->where('Empresa_id', Auth::user()->Empresa_id)->first();

    } else if ($rol == 'SUCURSAL' or $rol == 'RECEPCIONISTA') {

        $suc = Sucursal::borrado(false)->activo(true)
            ->where(function ($query) {
                $query->where('ReservaMesaPosdatada', true)->orWhere('ReservaMesaCurso', true);
            })->where('_id', Auth::user()->Sucursal_id)->first();

    }

    if (!$suc) {

        return ['empresa' => '', 'sucursal' => ''];

    } else {

        $empresa = (string) $suc->Empresa_id;
        $sucursal = (string) $suc->_id;

        return ['empresa' => $empresa, 'sucursal' => $sucursal];

    }

}

function isPosdatadoFechaReserva($fecha)
{

    $fechaReserva = $fecha;

    if ($fechaReserva->isToday()) {
        return false;
    } else {
        return true;
    }

}

function getReservaDiaMR($sucursal)
{

    $estados = [new ObjectId('5c942a3c57b3eb1986ba242f'), new ObjectId('5c942a9424fafb1986c39d9d')];

    $reservas = \App\Models\MongoDB\Reserva::borrado(false)->activo(true)->where('Sucursal_id', new ObjectId($sucursal))->whereIn('Estatus', $estados)->get();

    $result = [];

    if ($reservas) {

        foreach ($reservas as $r) {

            if ($r->FechaReserva->isToday()) {

                $timer = $r->FechaReserva->diffInMinutes();
                $estatus = (string) $r->Estatus;
                $notificaciones = '';

                if ($r->Manual) {
                    $nombre = $r->Nombre;
                    $apellido = $r->Apellido;
                    $telefono = $r->Telefono;
                    $correo = $r->Correo;
                } else {
                    $nombre = Cliente::find($r->Cliente_id)->Nombre;
                    $apellido = Cliente::find($r->Cliente_id)->Apellido;
                    $telefono = Cliente::find($r->Cliente_id)->Telefono;
                    $correo = Cliente::find($r->Cliente_id)->Correo;
                }

                if ($estatus == '5c942a9424fafb1986c39d9d') {

                    $notificaciones = implode(' - ', $r->Notificaciones);

                }

                $result[] = [
                    'id' => (string) $r->_id,
                    'nombre' => $nombre,
                    'apellido' => $apellido,
                    'comensales' => $r->Comensales,
                    'fechau' => $r->FechaReserva->format('Y-m-d\TH:i'),
                    'fechap' => $r->FechaReserva->format('Y-m-d H:i:s'),
                    'fecha' => $r->FechaReserva->format('d/m/Y h:i A'),
                    'fechacortareserva' => $r->FechaReserva->format('d/m/Y'),
                    'horareserva' => $r->FechaReserva->format('h:i A'),
                    'timer' => $timer,
                    'telefono' => $telefono,
                    'correo' => $correo,
                    'sector' => \App\Models\MongoDB\SectorMesa::find($r->Mesa)->Nombre,
                    'sectorid' => (string) $r->Mesa,
                    'estatusid' => $estatus,
                    'estatus' => \App\Models\MongoDB\EstatusReserva::find($r->Estatus)->Nombre,
                    'notificaciones' => $notificaciones,
                    'manual' => $r->Manual,
                ];
            }
        }

    }

    return $result;

}

function getReservaPosdatadaMR($sucursal)
{

    $estados = [new ObjectId('5c942a3c57b3eb1986ba242f'), new ObjectId('5c942a9424fafb1986c39d9d')];

    $reservas = \App\Models\MongoDB\Reserva::borrado(false)->activo(true)->where('Sucursal_id', new ObjectId($sucursal))->whereIn('Estatus', $estados)->get();

    $result = [];

    if ($reservas) {

        foreach ($reservas as $r) {

            if (!$r->FechaReserva->isToday()) {

                $timer = $r->FechaReserva->diffInMinutes();
                $estatus = (string) $r->Estatus;
                $notificaciones = '';

                if ($r->Manual) {
                    $nombre = $r->Nombre;
                    $apellido = $r->Apellido;
                    $telefono = $r->Telefono;
                    $correo = $r->Correo;
                } else {
                    $nombre = Cliente::find($r->Cliente_id)->Nombre;
                    $apellido = Cliente::find($r->Cliente_id)->Apellido;
                    $telefono = Cliente::find($r->Cliente_id)->Telefono;
                    $correo = Cliente::find($r->Cliente_id)->Correo;
                }

                if ($estatus == '5c942a9424fafb1986c39d9d') {

                    $notificaciones = implode(' - ', $r->Notificaciones);

                }

                $result[] = [
                    'id' => (string) $r->_id,
                    'nombre' => $nombre,
                    'apellido' => $apellido,
                    'comensales' => $r->Comensales,
                    'fechau' => $r->FechaReserva->format('Y-m-d\TH:i'),
                    'fechap' => $r->FechaReserva->format('Y-m-d H:i:s'),
                    'fecha' => $r->FechaReserva->format('d/m/Y h:i A'),
                    'fechacortareserva' => $r->FechaReserva->format('d/m/Y'),
                    'horareserva' => $r->FechaReserva->format('h:i A'),
                    'timer' => $timer,
                    'telefono' => $telefono,
                    'correo' => $correo,
                    'sector' => \App\Models\MongoDB\SectorMesa::find($r->Mesa)->Nombre,
                    'sectorid' => (string) $r->Mesa,
                    'estatusid' => $estatus,
                    'estatus' => \App\Models\MongoDB\EstatusReserva::find($r->Estatus)->Nombre,
                    'notificaciones' => $notificaciones,
                    'manual' => $r->Manual,
                ];
            }
        }

    }

    return $result;

}

function removeReservaMesa($mesa)
{

    $registro = \App\Models\MongoDB\Mesa::find($mesa);
    $registro->Reserva_id = null;
    $registro->save();

}

function agregarReservaMesa($mesa, $reserva)
{

    $registro = \App\Models\MongoDB\Mesa::find($mesa);
    $registro->Reserva_id = new ObjectId((string) $reserva);
    $registro->save();

}

function generateNotificacionReserva($reserva, $tipo)
{

    $r = \App\Models\MongoDB\Reserva::find($reserva);

    //procedo a guardarlos en la bd
    $registro = new \App\Models\MongoDB\NotificacionReserva;
    $registro->Reserva_id = new ObjectId((string) $reserva);
    $registro->Sucursal_id = new ObjectId((string) $r->Sucursal_id);
    $registro->TipoNotificacion_id = new ObjectId((string) $tipo);
    $registro->FechaAlerta = Carbon::now();
    $registro->Borrado = false;
    $registro->Activo = true;

    //verifico si fue exitoso el insert en la bd
    if ($registro->save()) {

        //disparo evento
        event(new \App\Events\AlertaNotificacionReservaEvent('Alerta generada'));

        return true;
    } else {
        return false;
    }

}

function generateLog($tipo, $guardia)
{

    $app = '5c9a73ab3eed3c27392b7eee'; //tipo de aplicacion - Backoffice
    $tipoLog = '';
    $result = false;
    $clienteid = '';
    $usuarioid = '';
    $mixto = false;

    if ($guardia == 'web') {
        $usuarioid = (string) Auth::user()->_id;
    }

    if ($tipo == 'inicio') {
        $tipoLog = '5c9a7288c2817d27395dc5a9';
    } else if ($tipo == 'cierre') {
        $tipoLog = '5c9a72dc3eed3c27392b7eed';
    }

    if (($tipoLog and $clienteid) or ($tipoLog and $usuarioid)) {

        //procedo a guardarlos en la bd
        $registro = new \App\Models\MongoDB\Log;
        $registro->Aplicacion_id = new ObjectId($app);
        $registro->Cliente_id = $clienteid == '' ? null : new ObjectId($clienteid);
        $registro->Usuario_id = $usuarioid == '' ? null : new ObjectId($usuarioid);
        $registro->TipoLog_id = new ObjectId($tipoLog);
        $registro->Mixto = $mixto;
        $registro->Fecha = Carbon::now();
        $registro->Borrado = false;
        $registro->Activo = true;

        //verifico si fue exitoso el insert en la bd
        if ($registro->save()) {
            $result = true;
        } else {
            $result = false;
        }

    }

    return $result;

}

function armandoLog($data)
{

    $result = [];

    if (!$data->isEmpty()) {

        foreach ($data as $l) {

            $result[] = [
                'id' => (string) $l->_id,
                'appid' => (string) $l->Aplicacion_id,
                'app' => \App\Models\MongoDB\Aplicacion::find($l->Aplicacion_id)->Nombre,
                'tipologid' => (string) $l->TipoLog_id,
                'tipolog' => \App\Models\MongoDB\TipoLog::find($l->TipoLog_id)->Nombre,
                'mixto' => $l->Mixto,
                'fechal' => $l->Fecha->format('Y-m-d H:i:s'),
                'fechalog' => $l->Fecha->format('d/m/Y h:i A'),
                'fechacortalog' => $l->Fecha->format('d/m/Y'),
                'horalog' => $l->Fecha->format('h:i A'),
            ];

        }

    }

    return $result;

}

function generateLogRepartidor($pedido, $tipo)
{

    $app = '5c9a73ab3eed3c27392b7eee'; //tipo de aplicacion - Backoffice
    $result = false;

    $usuarioid = (string) Auth::user()->_id;

    if ($tipo == 'disponible') {
        $estatus = '5ca9351ead40cd1f78458861';
    } else if ($tipo == 'asignado') {
        $estatus = '5ca9356b0918811f784dd50f';
    } else if ($tipo == 'entregado') {
        $estatus = '5ca9358d0918811f784dd511';
    } else if ($tipo == 'entregando') {
        $estatus = '5ca935a00918811f784dd512';
    } else if ($tipo == 'cancelado') {
        $estatus = '5ca9357c0918811f784dd510';
    }

    if (($estatus and $usuarioid)) {

        //procedo a guardarlos en la bd
        $registro = new \App\Models\MongoDB\LogRepartidor;
        $registro->Aplicacion_id = new ObjectId($app);
        $registro->Usuario_id = new ObjectId($usuarioid);
        $registro->Venta_id = new ObjectId($pedido);
        $registro->EstadoRepartidor = new ObjectId($estatus);
        $registro->Fecha = Carbon::now();
        $registro->Borrado = false;
        $registro->Activo = true;

        //verifico si fue exitoso el insert en la bd
        if ($registro->save()) {
            $result = true;
        } else {
            $result = false;
        }

    }

    return $result;

}

function countPedidosRepartidorDia($pedidos)
{

    $resultado = 0;
    $p = [];

    if ($pedidos) {

        foreach ($pedidos as $pe) {

            if ($pe->FechaPedido->isToday()) {

                $estado = (string) $pe->EstadoPedido;

                if ($estado == '5c0b87291ae21b4b5cd64dd5' or $estado == '5ca9924f0918811f784dd513') {

                    $p[] = [
                        'id' => $pe->_id,
                    ];
                }

            }

        }

        $resultado = count($p);

    }

    return $resultado;

}

function calcularDistanciaLatLng($lat1, $lng1, $lat2, $lng2, $unit = 'km', $decimals = 1)
{
    // Cálculo de la distancia en grados
    $degrees = rad2deg(acos((sin(deg2rad($lat1)) * sin(deg2rad($lat2))) + (cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($lng1 - $lng2)))));

    // Conversión de la distancia en grados a la unidad escogida (kilómetros, millas o millas naúticas)
    switch ($unit) {
        case 'km':
            $distance = $degrees * 111.13384; // 1 grado = 111.13384 km, basándose en el diametro promedio de la Tierra (12.735 km)
            break;
        case 'mi':
            $distance = $degrees * 69.05482; // 1 grado = 69.05482 millas, basándose en el diametro promedio de la Tierra (7.913,1 millas)
            break;
        case 'nmi':
            $distance = $degrees * 59.97662; // 1 grado = 59.97662 millas naúticas, basándose en el diametro promedio de la Tierra (6,876.3 millas naúticas)
    }

    return round($distance, $decimals);
}

function getPedidosRepartidorDia($pedidos)
{

    $p = [];

    if ($pedidos) {

        foreach ($pedidos as $pe) {

            if ($pe->FechaPedido->isToday()) {

                $estado = (string) $pe->EstadoPedido;

                if ($estado == '5c0b87291ae21b4b5cd64dd5' or $estado == '5ca9924f0918811f784dd513') {

                    $sucursal = Sucursal::find($pe->Sucursal_id);

                    $km = 0;

                    if ($sucursal->Geoposicion['coordinates'][0] and $sucursal->Geoposicion['coordinates'][1]) {

                        $km = calcularDistanciaLatLng($sucursal->Geoposicion['coordinates'][0], $sucursal->Geoposicion['coordinates'][1], ClienteDireccion::find($pe->DireccionEnvio)->Latitud, ClienteDireccion::find($pe->DireccionEnvio)->Longitud);
                    }

                    $p[] = [
                        '_id' => $pe->_id,
                        'Pedido' => $pe->NumeroOrden,
                        'Fecha' => $pe->FechaPedido->format('d/m/Y h:i A'),
                        'ImporteTotal' => $pe->ImporteTotal,
                        'PrecioEnvio' => empty($pe->PrecioEnvio) ? '' : $pe->PrecioEnvio,
                        'ImporteCliente' => isset($pe->EfectivoPago) ? (float) $pe->EfectivoPago : '',
                        'Estatus' => (string) $pe->EstadoRepartidor,
                        'Km' => $km,
                    ];
                }

            }

        }

    }

    return $p;

}

