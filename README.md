# Sistema básico de puntaciones

Este repositorio contiene el código de servidor así como la web cliente para el sistema de puntuaciones finales en San Blas 2016.

## PENDIENTE

Se ha desarrollado muy rápidamente y hay mucho que mejorar:

* Refactorizar y modularizar el cliente, ahora está todo en un único JS
* Usar IndexedDB - ahora se usa localStorage
* Servidor - Securizar, control de acceso, API para actualizar resultados
* Servidor Endpoints:
 * PUT /sanblas/v1/arquero/:id
 * DELETE /sanblas/v1/arquero/:id
* Cliente - Enviar resultados finales al servidor.
