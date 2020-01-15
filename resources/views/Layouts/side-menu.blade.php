
<aside class="left-sidebar">

    <ul class="sidebar-nav mt-3">

        <li class="sidebar-nav-link active">
            <a href="{{ route('welcome') }}">
                <i class="fas fa-tachometer-alt sidebar-nav-link-logo"></i> Dashboard
            </a>
        </li>

        @if(Auth::user()->hasPermission('multimedia', 'show'))
            <li class="sidebar-nav-link">
                <a href="{{ route('multimedia') }}">
                    <i class="fas fa-compact-disc sidebar-nav-link-logo"></i> Multimedia
                </a>
            </li>
        @endif

        <li class="sidebar-nav-link sidebar-nav-link-group">
            <a data-subnav-toggle>
                <i class="fas fa-user-friends sidebar-nav-link-logo"></i> Invitados
                <span class="fa fa-chevron-right subnav-toggle-icon subnav-toggle-icon-closed"></span>
                <span class="fa fa-chevron-down subnav-toggle-icon subnav-toggle-icon-opened"></span>
            </a>

            <ul class="sidebar-nav">

                @if(true)
                    <li class="sidebar-nav-link">
                        <a href="{{ route('invitados.invitacion') }}">
                            <i class="fas fa-envelope-open-text sidebar-nav-link-logo"></i> Invitación
                        </a>
                    </li>
                @endif


                @if(true)
                    <li class="sidebar-nav-link">
                        <a href="{{ route('invitados.invitado') }}">
                            <i class="fas fa-user-friends sidebar-nav-link-logo"></i> Invitados
                        </a>
                    </li>
                @endif

                @if(true)
                    <li class="sidebar-nav-link">
                        <a href="{{ route('invitados.asiento') }}">
                            <i class="fas fa-chair sidebar-nav-link-logo"></i> Asientos
                        </a>
                    </li>
                @endif

                @if(true)
                    <li class="sidebar-nav-link">
                        <a href="{{ route('invitados.regalo') }}">
                            <i class="fas fa-gift sidebar-nav-link-logo"></i> Regalos
                        </a>
                    </li>
                @endif
            </ul>
        </li>

        <li class="sidebar-nav-link sidebar-nav-link-group">
            <a data-subnav-toggle>
                <i class="fas fa-tools sidebar-nav-link-logo"></i> Configuración
                <span class="fa fa-chevron-right subnav-toggle-icon subnav-toggle-icon-closed"></span>
                <span class="fa fa-chevron-down subnav-toggle-icon subnav-toggle-icon-opened"></span>
            </a>

            <ul class="sidebar-nav">

                @if(Auth::user()->hasPermission('biblioteca', 'show'))
                    <li class="sidebar-nav-link">
                        <a href="{{ route('configuracion.biblioteca') }}">
                            <i class="fas fa-book sidebar-nav-link-logo"></i> Biblioteca
                        </a>
                    </li>
                @endif


                @if(Auth::user()->hasPermission('empresa', 'show'))
                    <li class="sidebar-nav-link">
                        <a href="{{ route('configuracion.empresa') }}">
                            <i class="fas fa-industry sidebar-nav-link-logo"></i> Empresas
                        </a>
                    </li>
                @endif

                @if(Auth::user()->hasPermission('cliente', 'show'))
                    <li class="sidebar-nav-link">
                        <a href="{{ route('configuracion.cliente') }}">
                            <i class="fas fa-user-tie sidebar-nav-link-logo"></i> Invitados
                        </a>
                    </li>
                @endif

                @if(Auth::user()->hasPermission('monitor', 'show'))
                    <li class="sidebar-nav-link">
                        <a href="{{ route('configuracion.monitor') }}">
                            <i class="fas fa-desktop sidebar-nav-link-logo"></i> Monitor
                        </a>
                    </li>
                @endif

                @if(Auth::user()->hasPermission('usuario', 'show'))
                    <li class="sidebar-nav-link">
                        <a href="{{ route('configuracion.usuario') }}">
                            <i class="fas fa-user-cog sidebar-nav-link-logo"></i> Usuarios
                        </a>
                    </li>
                @endif
                @if(Auth::user()->hasPermission('agenda', 'show'))
                    <li class="sidebar-nav-link">
                        <a href="{{ route('configuracion.agenda') }}">
                            <i class="fas fa-address-book sidebar-nav-link-logo"></i> Agendas
                        </a>
                    </li>
                @endif
                <!-- @if(Auth::user()->hasPermission('etapas', 'show'))
                    <li class="sidebar-nav-link">
                        <a href="{{ route('configuracion.menug_platos') }}">
                            <i class="fas fa-coffee sidebar-nav-link-logo"></i> Menú Gastronómico
                        </a>
                    </li>
                @endif -->
                @if(Auth::user()->hasPermission('etapas', 'show'))
                    <li class="sidebar-nav-link">
                        <a href="{{ route('configuracion.menug_etapas') }}">
                            <i class="fas fa-folder-open sidebar-nav-link-logo"></i> Menú Etapas
                        </a>
                    </li>
                @endif
                @if(Auth::user()->hasPermission('platos', 'show'))
                    <li class="sidebar-nav-link">
                        <a href="{{ route('configuracion.menug_platos') }}">
                            <i class="fas fa-coffee sidebar-nav-link-logo"></i> Menú Platos
                        </a>
                    </li>
                @endif
                    
            </ul>
        </li>
    </ul>
</aside>
