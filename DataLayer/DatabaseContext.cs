using DataLayer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataLayer
{
    public partial class DatabaseContext:DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {

        }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<UserType> UserTypes { get; set; }
        public DbSet<ExpensesTypes> ExpensesTypes { get; set; }
        public DbSet<MembershipTypes> MembershipTypes { get; set; }
        public DbSet<MemberShip> MemberShips { get; set; }
        public DbSet<MembersAttendance> MembersAttendances { get; set; }
        public DbSet<MenuRights> MenusRights { get; set; }
        public DbSet<MembershipPayments> MembershipPayments { get; set; }
        public DbSet<PartialPayments> PartialPayments { get; set; }
        public DbSet<InternalExpenses> InternalExpenses { get; set; }
        public DbSet<AdvancePaymentStaff> AdvancePaymentStaff { get; set; }
        public DbSet<SalaryPaymentStaff> SalaryPaymentStaff { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<SoldProducts> SoldProducts { get; set; }
        public DbSet<PersonalTraining> PersonalTrainings { get; set; }
        public DbSet<ProvisionalMember> ProvisionalMembers { get; set; }
        public DbSet<RequestTrainers> RequestTrainers { get; set; }
        public DbSet<Provinces> Province { get; set; }
        public DbSet<Districts> District { get; set; }
    }
}
