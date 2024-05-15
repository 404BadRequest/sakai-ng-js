import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { User } from 'src/app/reserva/api/user';
import { UserService } from 'src/app/reserva/service/user.service';
import { Rol } from 'src/app/reserva/api/rol';
import { RolService } from 'src/app/reserva/service/rol.service';

@Component({
  templateUrl: './admin-usuarios.component.html',
  providers: [MessageService]
})
export class AdminUsuariosComponent implements OnInit{
    userDialog: boolean = false;
    deleteUserDialog: boolean = false;
    deleteUsersDialog: boolean = false;
    roles: any[] = [];
    rol: Rol = {};
    users: User[] = [];
    user: User = {};
    selectedUsers: User[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    selectedState: any = null;
    selectedRols: any = null;
    dropdownItemsRols: any = null;
    selectedRole: any;
    loading: boolean = false;
    dropdownItemsStates = [
        { name: 'Activo', code: '1' },
        { name: 'Inactivo', code: '2' }
      ];
  
    constructor(private userService: UserService, private rolService: RolService, private messageService: MessageService, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
      
      this.getUsers();
      
      this.statuses = [
        { label: 'Vigente', value: '1' },
        { label: 'Inactivo', value: '0' }
      ];

      this.getRoles();
    }
    getUsers(){
      return this.userService.getUsersApiJs().subscribe(data => this.users = data);
    }

    getRoles(): void {
        this.rolService.getRolesVigentes()
          .subscribe(data => {
            this.roles = data;
            // Actualiza this.dropdownItemsRols con los roles obtenidos
            this.dropdownItemsRols = this.roles.map(role => ({ name: role.Nombre, code: role.Id }));
          }, error => {
            console.error('Error en la solicitud de roles:', error);
        });
    }

    openNew() {
        this.user = {};
        this.submitted = false;
        this.userDialog = true;
    }

    deleteSelectedUsers() {
        this.deleteUsersDialog = true;
    }

    editUser(user: User) {
        this.selectedRols = user.RolId;
        
        const selectedRol = this.dropdownItemsRols.find((rol: { code: any; }) => rol.code === this.selectedRols);
        if (selectedRol) {
            const selectedRoleId = user.RolId;
            
            this.user = { ...user, RolId: selectedRol.name };
            this.selectedRole = this.dropdownItemsRols.find(role => role.code === selectedRoleId);
            this.cdr.detectChanges();
    
            this.userDialog = true;
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El rol asignado al usuario no corresponde', life: 3000 });
        }
    }

    deleteUser(user: User) {
        this.deleteUserDialog = true;
        this.user = { ...user };
    }

    confirmDeleteSelected() {
        this.deleteUsersDialog = false;
        this.users = this.users.filter(val => !this.selectedUsers.includes(val));
        this.messageService.add({ severity: 'error', summary: 'Successful', detail: 'Usuario eliminado', life: 3000 });
        this.selectedUsers = [];
    }

    confirmDelete() {
        this.deleteUserDialog = false;
        this.onDeleteUser(this.user.Id, this.user);
        this.messageService.add({ severity: 'error', summary: 'Successful', detail: 'Usuario eliminado', life: 3000 });
        this.user = {};
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    saveUser() {
        this.submitted = true;
      
        if (this.user.Nombres?.trim()) {
          this.loading = true; // Habilita el indicador de carga
      
          if (this.user.Id) {
            console.log(this.user);
            this.onUpdateUser(this.user.Id, this.user);
      
            // Simulación de un proceso asíncrono
            setTimeout(() => {
              this.loading = false;
              this.userDialog = false;
              this.user = {};
              this.messageService.add({ severity: 'success', summary: 'Modificación', detail: 'Usuario actualizado', life: 3000 });
            }, 1000);
          } else {
            this.onCreateNewUser(this.user);
      
            // Simulación de un proceso asíncrono
            setTimeout(() => {
              this.loading = false;
              this.userDialog = false;
              this.user = {};
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Usuario creado', life: 3000 });
            }, 1000);
          }
        }
      }
    updateUserRole(selectedValue: any) {
        // Asigna el valor interno (Id) a user.RolId
        this.user.RolId = selectedValue.code;
    }

    onUpdateUser(Id: string, user){
        this.userService.putUserById(Id, user)
        .subscribe(response => {
            console.log({msg: `Registro actualizado`});
            this.getUsers();
        }, error => {
            console.error('Error en la solicitud:', error);
        });
    }
    onCreateNewUser(user){
        this.userService.createNewUser(user)
        .subscribe(response => {
            console.log({msg: `Registro creado`});
            this.getUsers();
        }, error => {
            console.error('Error en la solicitud:', error);
        });
    }
    onDeleteUser(Id: string, user){
        this.userService.deleteUserById(Id, user)
        .subscribe(response => {
            console.log({msg: `Registro eliminado`});
            this.getUsers();
        }, error => {
            console.error('Error en la solicitud:', error);
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].Id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
