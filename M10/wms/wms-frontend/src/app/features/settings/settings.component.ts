import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { UserProfile } from '../../features/user-management/user.model';
import { LucideAngularModule, User, Mail, Phone, Shield, Save, Eye, EyeOff } from 'lucide-angular';
import { Heading1Component, SubtitleComponent, Heading4Component, SectionHeadingComponent } from '../../ui-library/Typography/Typography.component';
import { SectionComponent } from '../../ui-library/Section.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, Heading1Component, SubtitleComponent, Heading4Component, SectionComponent, SectionHeadingComponent],
  template: `
    <div class="space-y-6">
      <!-- Header --> 
      <div class="flex justify-between items-center pb-4">
        <div>
          <ui-heading1>Settings</ui-heading1>
          <ui-subtitle>Manage your account settings and preferences</ui-subtitle>
        </div>
      </div>

      <!-- Profile Settings -->
      <ui-section>
        <ui-section-heading class="mb-6">
          <lucide-icon [img]="UserIcon" size="20"></lucide-icon>
          Profile Information
        </ui-section-heading>

        <form (ngSubmit)="saveProfile()" #profileForm="ngForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Avatar Section -->
            <div class="md:col-span-2 flex items-center space-x-6">
              <div class="flex-shrink-0">
                <div class="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
                  <span class="text-2xl font-medium text-primary-600">{{ currentUser?.name?.charAt(0) || 'U' }}</span>
                </div>
              </div>
              <div>
                <ui-heading4>Profile Picture</ui-heading4>
                <p class="text-sm text-gray-500 dark:text-gray-400">Update your profile picture</p>
                <button type="button" class="mt-2 btn btn-secondary">
                  Change Avatar
                </button>
              </div>
            </div>

            <!-- Full Name -->
            <div>
              <label for="fullName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div class="relative">
                <lucide-icon [img]="UserIcon" size="18" class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></lucide-icon>
                <input type="text" 
                       id="fullName"
                       name="fullName"
                       [(ngModel)]="profileData.fullName"
                       class="input pl-10"
                       required>
              </div>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div class="relative">
                <lucide-icon [img]="MailIcon" size="18" class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></lucide-icon>
                <input type="email" 
                       id="email"
                       name="email"
                       [(ngModel)]="profileData.email"
                       class="input pl-10"
                       required>
              </div>
            </div>

            <!-- Phone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <div class="relative">
                <lucide-icon [img]="PhoneIcon" size="18" class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></lucide-icon>
                <input type="tel" 
                       id="phone"
                       name="phone"
                       [(ngModel)]="profileData.phone"
                       class="input pl-10">
              </div>
            </div>

            <!-- Role (Read-only) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Role
              </label>
              <div class="relative">
                <lucide-icon [img]="ShieldIcon" size="18" class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"></lucide-icon>
                <input type="text" 
                       [value]="getUserRole()"
                       class="input pl-10 bg-gray-50 dark:bg-dark-700"
                       readonly>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button type="submit" 
                    [disabled]="!profileForm.form.valid || saving"
                    class="btn btn-primary">
              <lucide-icon [img]="SaveIcon" size="18" class="mr-2"></lucide-icon>
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </ui-section>

      <!-- Security Settings -->
      <ui-section>
        <ui-section-heading class="mb-6">
          <lucide-icon [img]="ShieldIcon" size="20"></lucide-icon>
          Security Settings
        </ui-section-heading>

        <form (ngSubmit)="changePassword()" #passwordForm="ngForm">
          <div class="space-y-6">
            <!-- Current Password -->
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <div class="relative">
                <input [type]="showCurrentPassword ? 'text' : 'password'" 
                       id="currentPassword"
                       name="currentPassword"
                       [(ngModel)]="passwordData.currentPassword"
                       class="input pr-10"
                       required>
                <button type="button" 
                        (click)="showCurrentPassword = !showCurrentPassword"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <lucide-icon [img]="showCurrentPassword ? EyeOffIcon : EyeIcon" size="18"></lucide-icon>
                </button>
              </div>
            </div>

            <!-- New Password -->
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <div class="relative">
                <input [type]="showNewPassword ? 'text' : 'password'" 
                       id="newPassword"
                       name="newPassword"
                       [(ngModel)]="passwordData.newPassword"
                       class="input pr-10"
                       required
                       minlength="8">
                <button type="button" 
                        (click)="showNewPassword = !showNewPassword"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <lucide-icon [img]="showNewPassword ? EyeOffIcon : EyeIcon" size="18"></lucide-icon>
                </button>
              </div>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Password must be at least 8 characters long
              </p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <div class="relative">
                <input [type]="showConfirmPassword ? 'text' : 'password'" 
                       id="confirmPassword"
                       name="confirmPassword"
                       [(ngModel)]="passwordData.confirmPassword"
                       class="input pr-10"
                       required>
                <button type="button" 
                        (click)="showConfirmPassword = !showConfirmPassword"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <lucide-icon [img]="showConfirmPassword ? EyeOffIcon : EyeIcon" size="18"></lucide-icon>
                </button>
              </div>
              @if (passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword) {
                <div class="mt-1 text-xs text-error-600">
                  Passwords do not match
                </div>
              }
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button type="submit" 
                    [disabled]="!passwordForm.form.valid || passwordData.newPassword !== passwordData.confirmPassword || changingPassword"
                    class="btn btn-primary">
              <lucide-icon [img]="SaveIcon" size="18" class="mr-2"></lucide-icon>
              {{ changingPassword ? 'Changing...' : 'Change Password' }}
            </button>
          </div>
        </form>
      </ui-section>

      <!-- Account Information -->
      <ui-section>
        <ui-section-heading class="mb-6">Account Information</ui-section-heading>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Account Created</label>
            <p class="text-sm text-gray-900 dark:text-white mt-1">{{ currentUser?.warehouseAssignments?.[0]?.assignedFrom | date:'MMM d, y' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Last Login</label>
            <p class="text-sm text-gray-900 dark:text-white mt-1">{{ currentUser?.lastLogin | date:'MMM d, y h:mm a' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Assigned Warehouse</label>
            <p class="text-sm text-gray-900 dark:text-white mt-1">{{ currentUser?.warehouseAssignments?.[0]?.warehouseName || 'N/A' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Account Status</label>
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800 mt-1">
              Active
            </span>
          </div>
        </div>
      </ui-section>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  currentUser: UserProfile | null = null;
  saving = false;
  changingPassword = false;
  
  // Password visibility toggles
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  // Form data
  profileData = {
    fullName: '',
    email: '',
    phone: ''
  };

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // Lucide icons
  UserIcon = User;
  MailIcon = Mail;
  PhoneIcon = Phone;
  ShieldIcon = Shield;
  SaveIcon = Save;
  EyeIcon = Eye;
  EyeOffIcon = EyeOff;

  private authService = inject(AuthService);

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    if (this.currentUser) {
      this.profileData = {
        fullName: this.currentUser.name,
        email: this.currentUser.email,
        phone: this.currentUser.phone || ''
      };
    }
  }

  getUserRole(): string {
    return this.currentUser?.role?.[0]?.roleName || 'N/A';
  }

  saveProfile(): void {
    this.saving = true;
    
    // Simulate API call
    setTimeout(() => {
      console.log('Profile saved:', this.profileData);
      this.saving = false;
      // Show success message
    }, 1000);
  }

  changePassword(): void {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      return;
    }

    this.changingPassword = true;
    
    // Simulate API call
    setTimeout(() => {
      console.log('Password changed');
      this.changingPassword = false;
      // Clear form
      this.passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      // Show success message
    }, 1000);
  }
}