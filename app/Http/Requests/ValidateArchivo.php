<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;

class ValidateArchivo extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(Request $request)
    {

        $archivo = 'required|mimes:png,jpg,jpeg,mp4,mpeg,wav,mov,qt,mpga|max:10240';

        //$archivo = 'required';

        $rules = [
            'id-evento'            => 'required',
            //'tipo'                 => 'required',
            'archivo'              => $archivo,
            // 'name'                 => 'required|unique:Bibliotecas,Nombre',
            'categoria'            => 'required',
        ];

        return $rules;
    }

    public function messages()
    {
        return [
            'id-evento.required' => 'El id del evento es requerido. Consulte al administrador',
            //'tipo.required' => 'El tipo de archivo es requerido',
            'name.required'      => 'El nombre del archivo es requerido',
            // 'name.unique'        => 'El nombre de archivo ya esta en uso. Intente otro',
            'archivo.required'   => 'El archivo es requerido',
            'archivo.mimes'      => 'El archivo debe tener uno de los siguientes formato: jpg, jpeg, png, mp4, mov, qt, mp3',
            'archivo.max'        => 'El archivo debe tener un tamaño no mayor a 10MB',
            'categoria.required' => 'La categoria es requerida'
        ];
    }

    public function failedValidation(Validator $validator) {

        throw new HttpResponseException(response()->json($validator->errors()->first(), 422));
    }
}
