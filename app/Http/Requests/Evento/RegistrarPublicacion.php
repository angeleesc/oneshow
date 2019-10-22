<?php

namespace App\Http\Requests\Evento;

use Illuminate\Foundation\Http\FormRequest;

class RegistrarPublicacion extends FormRequest
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
    public function rules() {
        return [
            'eventoId' => 'required|exists:Eventos,_id',
            'descripcion' => 'required|string'
        ];
    }

    /**
     * Get messages of validation.
     *
     * @return array
     */
    public function messages() {
        return [
            'eventoId.required' => 'El id del evento es requerido.',
            'eventoId.exists' => 'El id del evento no esta registrado.'
        ];
    }
}
