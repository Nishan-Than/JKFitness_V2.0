using Microsoft.EntityFrameworkCore.Migrations;

namespace DataLayer.Migrations
{
    public partial class newFields_StaffPayment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "PTAmount",
                table: "SalaryPaymentStaff",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "SupplimentCommission",
                table: "SalaryPaymentStaff",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PTAmount",
                table: "SalaryPaymentStaff");

            migrationBuilder.DropColumn(
                name: "SupplimentCommission",
                table: "SalaryPaymentStaff");
        }
    }
}
